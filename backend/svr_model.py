import os
import pickle
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler
from sklearn.svm import SVR

MODEL_NAME = "svr_model.pkl"
POLLUTANT_FIELDS = [
    "PM2.5",
    "PM10",
    "NO",
    "NO2",
    "NOx",
    "NH3",
    "CO",
    "SO2",
    "O3",
    "Benzene",
    "Toluene",
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "cleaned_aqi_data.csv")

_MODEL_CACHE = None


def load_svr_model():
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    model_path = os.path.join(MODELS_DIR, MODEL_NAME)
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"{MODEL_NAME} not found. Train it first: python backend/svr_model.py"
        )

    with open(model_path, "rb") as f:
        _MODEL_CACHE = pickle.load(f)
    return _MODEL_CACHE


def _parse_date(date_text):
    parsed = pd.to_datetime(date_text, format="%d-%m-%y", errors="coerce")
    if pd.isna(parsed):
        parsed = pd.to_datetime(date_text, dayfirst=True, errors="coerce")
    if pd.isna(parsed):
        raise ValueError("Invalid Date. Use dd-mm-yy or dd-mm-yyyy format.")
    return parsed


def _build_features(payload):
    parsed_date = _parse_date(payload["Date"])
    row = {
        "City": str(payload["City"]).strip(),
        "year": int(parsed_date.year),
        "month": int(parsed_date.month),
        "day": int(parsed_date.day),
        "dayofweek": int(parsed_date.dayofweek),
    }

    for field in POLLUTANT_FIELDS:
        value = float(payload[field])
        if field in {"Benzene", "Toluene", "NO", "CO"}:
            value = float(np.log1p(max(value, 0.0)))
        row[field] = value

    return pd.DataFrame([row])


def predict_svr(payload):
    model = load_svr_model()
    features = _build_features(payload)
    return float(model.predict(features)[0])


def _prepare_training_data():
    df = pd.read_csv(DATA_PATH)
    parsed = pd.to_datetime(df["Date"], format="%d-%m-%y", errors="coerce")
    if parsed.isna().any():
        parsed = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")
    if parsed.isna().any():
        raise ValueError("Date parsing failed for some rows.")

    df = df.copy()
    df["year"] = parsed.dt.year
    df["month"] = parsed.dt.month
    df["day"] = parsed.dt.day
    df["dayofweek"] = parsed.dt.dayofweek
    df["_date_parsed"] = parsed
    df = df.drop(columns=["aqi_bucket"], errors="ignore")

    for col in ["Benzene", "Toluene", "NO", "CO"]:
        if col in df.columns:
            df[col] = np.log1p(df[col].clip(lower=0))

    df = df.sort_values("_date_parsed").reset_index(drop=True)
    split_index = int(len(df) * 0.8)
    train_df = df.iloc[:split_index]
    test_df = df.iloc[split_index:]

    drop_cols = ["AQI", "Date", "_date_parsed"]
    X_train = train_df.drop(columns=drop_cols, errors="ignore")
    X_test = test_df.drop(columns=drop_cols, errors="ignore")
    y_train = train_df["AQI"]
    y_test = test_df["AQI"]
    return X_train, X_test, y_train, y_test, train_df, test_df


def train_svr_model():
    os.makedirs(MODELS_DIR, exist_ok=True)
    X_train, X_test, y_train, y_test, train_df, test_df = _prepare_training_data()

    categorical = [c for c in ["City"] if c in X_train.columns]
    numeric = [c for c in X_train.columns if c not in categorical]
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", RobustScaler(), numeric),
        ],
        remainder="drop",
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", SVR(kernel="rbf", C=100, gamma="scale", epsilon=0.2)),
        ]
    )
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    model_path = os.path.join(MODELS_DIR, MODEL_NAME)
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    print(
        f"Train range: {train_df['_date_parsed'].min().date()} -> {train_df['_date_parsed'].max().date()}"
    )
    print(
        f"Test range: {test_df['_date_parsed'].min().date()} -> {test_df['_date_parsed'].max().date()}"
    )
    print(f"{MODEL_NAME} saved -> MAE: {mae:.2f}, RMSE: {rmse:.2f}, R2: {r2:.3f}")


if __name__ == "__main__":
    train_svr_model()

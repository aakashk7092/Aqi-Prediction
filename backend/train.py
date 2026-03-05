import os
import pickle
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "cleaned_aqi_data.csv")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")


def add_time_features(df):
    date_parsed = pd.to_datetime(df["Date"], format="%d-%m-%y", errors="coerce")
    if date_parsed.isna().any():
        date_parsed = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")

    if date_parsed.isna().any():
        raise ValueError("Date parsing failed for some rows.")

    df = df.copy()
    df["year"] = date_parsed.dt.year
    df["month"] = date_parsed.dt.month
    df["day"] = date_parsed.dt.day
    df["dayofweek"] = date_parsed.dt.dayofweek
    df["_date_parsed"] = date_parsed
    return df


def prepare_features(df):
    df = add_time_features(df)
    df = df.drop(columns=["aqi_bucket"], errors="ignore")

    for col in ["Benzene", "Toluene", "NO", "CO"]:
        if col in df.columns:
            df[col] = np.log1p(df[col].clip(lower=0))

    df = df.sort_values("_date_parsed").reset_index(drop=True)
    return df


def time_split(df, target_col="AQI", test_fraction=0.2):
    split_index = int(len(df) * (1 - test_fraction))
    train_df = df.iloc[:split_index]
    test_df = df.iloc[split_index:]

    drop_cols = [target_col, "Date", "_date_parsed"]
    X_train = train_df.drop(columns=drop_cols, errors="ignore")
    X_test = test_df.drop(columns=drop_cols, errors="ignore")
    y_train = train_df[target_col]
    y_test = test_df[target_col]
    return X_train, X_test, y_train, y_test, train_df, test_df


def build_preprocessor(feature_columns, scale_numeric=True):
    categorical = [c for c in ["City"] if c in feature_columns]
    numeric = [c for c in feature_columns if c not in categorical]

    numeric_step = RobustScaler() if scale_numeric else "passthrough"
    return ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", numeric_step, numeric),
        ],
        remainder="drop",
    )


def train_and_save_models():
    os.makedirs(MODELS_DIR, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    df = prepare_features(df)
    X_train, X_test, y_train, y_test, train_df, test_df = time_split(df)

    print(
        "Time split:"
        f" train={train_df['_date_parsed'].min().date()} to {train_df['_date_parsed'].max().date()}"
        f" ({len(train_df)} rows),"
        f" test={test_df['_date_parsed'].min().date()} to {test_df['_date_parsed'].max().date()}"
        f" ({len(test_df)} rows)"
    )

    models = {
        "linear_model.pkl": Pipeline(
            steps=[
                ("preprocessor", build_preprocessor(list(X_train.columns), scale_numeric=True)),
                ("model", LinearRegression()),
            ]
        ),
        "rf_model.pkl": Pipeline(
            steps=[
                ("preprocessor", build_preprocessor(list(X_train.columns), scale_numeric=False)),
                ("model", RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1)),
            ]
        ),
        "svr_model.pkl": Pipeline(
            steps=[
                ("preprocessor", build_preprocessor(list(X_train.columns), scale_numeric=True)),
                ("model", SVR(kernel="rbf", C=100, gamma="scale", epsilon=0.2)),
            ]
        ),
    }

    for filename, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        mae = mean_absolute_error(y_test, predictions)
        rmse = np.sqrt(mean_squared_error(y_test, predictions))
        r2 = r2_score(y_test, predictions)

        model_path = os.path.join(MODELS_DIR, filename)
        with open(model_path, "wb") as f:
            pickle.dump(model, f)

        print(f"{filename} saved -> MAE: {mae:.2f}, RMSE: {rmse:.2f}, R2: {r2:.3f}")


if __name__ == "__main__":
    train_and_save_models()

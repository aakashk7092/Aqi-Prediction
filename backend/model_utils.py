import os

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "cleaned_aqi_data.csv")

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

FEATURE_COLUMNS = ["City", "Date"] + POLLUTANT_FIELDS
TARGET_COLUMN = "AQI"


def load_dataset():
    return pd.read_csv(DATA_PATH)


def parse_date(date_text):
    parsed = pd.to_datetime(date_text, format="%d-%m-%y", errors="coerce")
    if pd.isna(parsed):
        parsed = pd.to_datetime(date_text, dayfirst=True, errors="coerce")
    if pd.isna(parsed):
        raise ValueError("Invalid Date. Use dd-mm-yy or dd-mm-yyyy format.")
    return parsed


def prepare_features(df):
    frame = df.copy()
    parsed_dates = pd.to_datetime(frame["Date"], format="%d-%m-%y", errors="coerce")

    if parsed_dates.isna().any():
        parsed_dates = pd.to_datetime(frame["Date"], dayfirst=True, errors="coerce")

    if parsed_dates.isna().any():
        raise ValueError("Some Date values could not be parsed from the dataset.")

    frame["City"] = frame["City"].astype(str).str.strip()
    frame["year"] = parsed_dates.dt.year
    frame["month"] = parsed_dates.dt.month
    frame["day"] = parsed_dates.dt.day
    frame["dayofweek"] = parsed_dates.dt.dayofweek

    for field in POLLUTANT_FIELDS:
        frame[field] = pd.to_numeric(frame[field], errors="coerce")

    return frame


def build_input_frame(payload):
    parsed_date = parse_date(payload["Date"])
    row = {
        "City": str(payload["City"]).strip(),
        "year": int(parsed_date.year),
        "month": int(parsed_date.month),
        "day": int(parsed_date.day),
        "dayofweek": int(parsed_date.dayofweek),
    }

    for field in POLLUTANT_FIELDS:
        row[field] = float(payload[field])

    return pd.DataFrame([row])


def get_training_data():
    data = load_dataset()
    prepared = prepare_features(data)

    feature_columns = ["City", "year", "month", "day", "dayofweek"] + POLLUTANT_FIELDS
    X = prepared[feature_columns]
    y = pd.to_numeric(prepared[TARGET_COLUMN], errors="coerce")

    valid_rows = y.notna()
    X = X.loc[valid_rows].reset_index(drop=True)
    y = y.loc[valid_rows].reset_index(drop=True)
    return X, y


def build_preprocessor(scale_numeric):
    categorical_features = ["City"]
    numeric_features = ["year", "month", "day", "dayofweek"] + POLLUTANT_FIELDS

    numeric_steps = [("imputer", SimpleImputer(strategy="median"))]
    if scale_numeric:
        numeric_steps.append(("scaler", RobustScaler()))

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    numeric_pipeline = Pipeline(steps=numeric_steps)

    return ColumnTransformer(
        transformers=[
            ("categorical", categorical_pipeline, categorical_features),
            ("numeric", numeric_pipeline, numeric_features),
        ]
    )


def summarise_dataset():
    data = load_dataset()
    prepared = prepare_features(data)
    parsed_dates = pd.to_datetime(data["Date"], format="%d-%m-%y", errors="coerce")

    if parsed_dates.isna().any():
        parsed_dates = pd.to_datetime(data["Date"], dayfirst=True, errors="coerce")

    pollutant_means = {
        field: round(float(prepared[field].mean(skipna=True)), 2) for field in POLLUTANT_FIELDS
    }

    bucket_counts = (
        data["aqi_bucket"]
        .fillna("Unknown")
        .value_counts()
        .sort_index()
        .to_dict()
    )

    city_summary = (
        prepared.groupby("City", dropna=False)
        .agg(avg_aqi=(TARGET_COLUMN, "mean"), days=(TARGET_COLUMN, "size"))
        .sort_values("avg_aqi", ascending=False)
        .head(8)
        .reset_index()
    )

    top_cities = [
        {
            "city": row["City"],
            "avg_aqi": round(float(row["avg_aqi"]), 2),
            "days": int(row["days"]),
        }
        for _, row in city_summary.iterrows()
    ]

    correlation_fields = POLLUTANT_FIELDS + [TARGET_COLUMN]
    correlation_matrix = prepared[correlation_fields].corr(numeric_only=True).fillna(0.0)
    aqi_correlation = {
        field: round(float(correlation_matrix.loc[field, TARGET_COLUMN]), 3)
        for field in POLLUTANT_FIELDS
        if field in correlation_matrix.index
    }

    latest_rows = prepared.sort_values(["year", "month", "day"]).tail(6)
    recent_samples = [
        {
            "city": row["City"],
            "date": f"{int(row['day']):02d}-{int(row['month']):02d}-{int(row['year'])}",
            "aqi": round(float(row[TARGET_COLUMN]), 2),
            "pm25": round(float(row["PM2.5"]), 2) if not pd.isna(row["PM2.5"]) else None,
            "pm10": round(float(row["PM10"]), 2) if not pd.isna(row["PM10"]) else None,
        }
        for _, row in latest_rows.iterrows()
    ]

    return {
        "row_count": int(len(prepared)),
        "city_count": int(prepared["City"].nunique()),
        "date_range": {
            "start": str(parsed_dates.min().date()),
            "end": str(parsed_dates.max().date()),
        },
        "avg_aqi": round(float(prepared[TARGET_COLUMN].mean(skipna=True)), 2),
        "max_aqi": round(float(prepared[TARGET_COLUMN].max(skipna=True)), 2),
        "min_aqi": round(float(prepared[TARGET_COLUMN].min(skipna=True)), 2),
        "pollutant_means": pollutant_means,
        "bucket_counts": bucket_counts,
        "top_cities": top_cities,
        "aqi_correlation": aqi_correlation,
        "recent_samples": recent_samples,
    }

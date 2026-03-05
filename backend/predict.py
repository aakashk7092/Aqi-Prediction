import os
import pickle
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

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

_MODEL_CACHE = {}
ALLOWED_MODELS = {"rf_model.pkl", "svr_model.pkl", "linear_model.pkl"}


def _validate_model_name(model_name):
    name = os.path.basename(str(model_name))
    if name != str(model_name):
        raise ValueError("Invalid model_name.")
    if name not in ALLOWED_MODELS:
        allowed = ", ".join(sorted(ALLOWED_MODELS))
        raise ValueError(f"Unsupported model_name. Use one of: {allowed}")
    return name


def load_model(model_name="rf_model.pkl"):
    model_name = _validate_model_name(model_name)

    if model_name in _MODEL_CACHE:
        return _MODEL_CACHE[model_name]

    model_path = os.path.join(MODELS_DIR, model_name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. Run backend/train.py first."
        )

    with open(model_path, "rb") as f:
        model = pickle.load(f)
    _MODEL_CACHE[model_name] = model
    return model


def _parse_date(date_text):
    parsed = pd.to_datetime(date_text, format="%d-%m-%y", errors="coerce")
    if pd.isna(parsed):
        parsed = pd.to_datetime(date_text, dayfirst=True, errors="coerce")
    if pd.isna(parsed):
        raise ValueError("Invalid Date. Use dd-mm-yy or dd-mm-yyyy format.")
    return parsed


def _build_feature_frame(payload):
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


def predict_aqi(payload, model_name="rf_model.pkl"):
    model = load_model(model_name)
    features = _build_feature_frame(payload)
    prediction = model.predict(features)[0]
    return float(prediction)


if __name__ == "__main__":
    sample_payload = {
        "City": "Delhi",
        "Date": "05-03-26",
        "PM2.5": 35,
        "PM10": 80,
        "NO": 18,
        "NO2": 25,
        "NOx": 30,
        "NH3": 12,
        "CO": 0.7,
        "SO2": 8,
        "O3": 30,
        "Benzene": 1.1,
        "Toluene": 2.4,
    }
    print(f"Predicted AQI: {predict_aqi(sample_payload):.2f}")

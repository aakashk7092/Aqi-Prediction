from flask import Flask, request, jsonify
try:
    from .linear_model import POLLUTANT_FIELDS, predict_linear
    from .svr_model import predict_svr
    from .random_forest_model import predict_random_forest
except ImportError:
    from linear_model import POLLUTANT_FIELDS, predict_linear
    from svr_model import predict_svr
    from random_forest_model import predict_random_forest

app = Flask(__name__)

MODEL_HANDLERS = {
    "linear_model.pkl": predict_linear,
    "svr_model.pkl": predict_svr,
    "rf_model.pkl": predict_random_forest,
}

POLLUTANT_LIMITS = {
    "PM2.5": 60,
    "PM10": 100,
    "NO": 40,
    "NO2": 40,
    "NOx": 80,
    "NH3": 200,
    "CO": 2,
    "SO2": 80,
    "O3": 100,
    "Benzene": 5,
    "Toluene": 10,
}


def _aqi_bucket(aqi_value):
    if aqi_value <= 50:
        return "Good", "Air quality is satisfactory."
    if aqi_value <= 100:
        return "Satisfactory", "Minor breathing discomfort to sensitive people."
    if aqi_value <= 200:
        return "Moderate", "Breathing discomfort to people with lung disease."
    if aqi_value <= 300:
        return "Poor", "Breathing discomfort on prolonged exposure."
    if aqi_value <= 400:
        return "Very Poor", "Respiratory illness on prolonged exposure."
    return "Severe", "Affects healthy people and seriously impacts patients."


def _pollutant_insights(data):
    levels = []
    ratios = []
    for field in POLLUTANT_FIELDS:
        value = float(data[field])
        limit = float(POLLUTANT_LIMITS[field])
        ratio = 0.0 if limit <= 0 else value / limit
        ratios.append(ratio)
        levels.append(
            {
                "name": field,
                "value": round(value, 2),
                "limit": round(limit, 2),
                "ratio": round(ratio, 3),
            }
        )

    levels.sort(key=lambda x: x["ratio"], reverse=True)
    top_three = levels[:3]
    risk_score = round(min(100.0, (sum(ratios) / len(ratios)) * 100.0), 2)
    return top_three, risk_score


def _recommendations(category, top_pollutants):
    tips = []
    if category in {"Poor", "Very Poor", "Severe"}:
        tips.append("Limit outdoor workouts and use an N95 mask in traffic-heavy areas.")
        tips.append("Keep windows closed during peak pollution hours and use air purification indoors.")
    else:
        tips.append("Prefer morning/evening ventilation and avoid roadside exposure for long durations.")

    names = [p["name"] for p in top_pollutants]
    if "PM2.5" in names or "PM10" in names:
        tips.append("Control dust sources and avoid open burning near residential zones.")
    if "NO2" in names or "NOx" in names:
        tips.append("Reduce vehicle idling and prefer public transport or carpooling.")
    if "CO" in names:
        tips.append("Ensure proper indoor ventilation and check combustion appliances.")
    return tips[:4]


def _validate_payload(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object."

    required_fields = ["City", "Date"] + POLLUTANT_FIELDS
    missing = [
        field
        for field in required_fields
        if field not in data or data[field] is None or str(data[field]).strip() == ""
    ]
    if missing:
        return f"Missing fields: {', '.join(missing)}"

    return None

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AQI Prediction API is running"})


@app.route("/models", methods=["GET"])
def models():
    return jsonify({"models": list(MODEL_HANDLERS.keys())})


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    validation_error = _validate_payload(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        model_name = data.get("model_name", "rf_model.pkl")
        if model_name not in MODEL_HANDLERS:
            supported = ", ".join(MODEL_HANDLERS.keys())
            return jsonify({"error": f"Unsupported model_name. Use one of: {supported}"}), 400

        predicted_aqi = MODEL_HANDLERS[model_name](data)
        bucket, advice = _aqi_bucket(predicted_aqi)
        top_pollutants, risk_score = _pollutant_insights(data)
        recommendations = _recommendations(bucket, top_pollutants)
        return jsonify(
            {
                "model": model_name,
                "predicted_aqi": round(predicted_aqi, 2),
                "aqi_category": bucket,
                "health_message": advice,
                "risk_score": risk_score,
                "top_pollutants": top_pollutants,
                "recommendations": recommendations,
            }
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/predict_all", methods=["POST", "OPTIONS"])
def predict_all():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    validation_error = _validate_payload(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        predictions = {}
        for model_name, handler in MODEL_HANDLERS.items():
            predictions[model_name] = round(float(handler(data)), 2)

        avg_aqi = sum(predictions.values()) / len(predictions)
        bucket, advice = _aqi_bucket(avg_aqi)
        top_pollutants, risk_score = _pollutant_insights(data)
        recommendations = _recommendations(bucket, top_pollutants)
        return jsonify(
            {
                "predictions": predictions,
                "average_aqi": round(avg_aqi, 2),
                "aqi_category": bucket,
                "health_message": advice,
                "risk_score": risk_score,
                "top_pollutants": top_pollutants,
                "recommendations": recommendations,
            }
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(debug=True)

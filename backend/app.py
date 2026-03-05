from flask import Flask, request, jsonify
try:
    from .predict import predict_aqi, POLLUTANT_FIELDS
except ImportError:
    from predict import predict_aqi, POLLUTANT_FIELDS

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AQI Prediction API is running"})


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    required_fields = ["City", "Date"] + POLLUTANT_FIELDS
    missing = [
        field
        for field in required_fields
        if field not in data or data[field] is None or str(data[field]).strip() == ""
    ]

    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        model_name = data.get("model_name", "rf_model.pkl")
        predicted_aqi = predict_aqi(data, model_name=model_name)
        return jsonify(
            {
                "model": model_name,
                "predicted_aqi": round(predicted_aqi, 2),
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

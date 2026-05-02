from flask import Flask, jsonify, request

app = Flask(__name__)

FEATURE_NAMES = [
    "pm25",
    "pm10",
    "no",
    "no2",
    "nox",
    "nh3",
    "co",
    "so2",
    "o3",
    "benzene",
]

# import trained models
try:
    from .linear_model import model as linear_model
    from .random_forest_model import model as rf_model
    from .svr_model import model as svm_model
except ImportError:
    from linear_model import model as linear_model
    from random_forest_model import model as rf_model
    from svr_model import model as svm_model


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return response


@app.route("/", methods=["GET"])
def home():
    return "Backend Running"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}

    for field in FEATURE_NAMES:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # get values from frontend
    pm25 = float(data["pm25"])
    pm10 = float(data["pm10"])
    no = float(data["no"])
    no2 = float(data["no2"])
    nox = float(data["nox"])
    nh3 = float(data["nh3"])
    co = float(data["co"])
    so2 = float(data["so2"])
    o3 = float(data["o3"])
    benzene = float(data["benzene"])

    # create input list
    values = [[pm25, pm10, no, no2, nox, nh3, co, so2, o3, benzene]]

    # predictions
    linear_pred = linear_model.predict(values)[0]
    rf_pred = rf_model.predict(values)[0]
    svm_pred = svm_model.predict(values)[0]

    # return result
    return jsonify(
        {
            "Linear Regression": round(linear_pred, 2),
            "Random Forest": round(rf_pred, 2),
            "SVM": round(svm_pred, 2),
        }
    )


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)

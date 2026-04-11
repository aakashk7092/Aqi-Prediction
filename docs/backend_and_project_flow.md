# Backend and Project Flow Explanation

## Files Covered

- [backend/app.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/app.py)
- [backend/pollution_analysis.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/pollution_analysis.py)
- [frontend/index.html](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/index.html)
- [frontend/style.css](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/style.css)
- [frontend/script.js](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/script.js)

---

## Backend API Explanation

The backend uses Flask.

Its main job is:

1. receive pollution values from the frontend
2. send them to all three models
3. return the prediction output as JSON

### Main Backend Route

## `GET /`

This route checks if the backend is running.

It returns:

- backend message
- feature names
- model names

## `POST /predict`

This route receives pollution values from the frontend.

Expected JSON fields:

- `pm25`
- `pm10`
- `no`
- `no2`
- `nox`
- `nh3`
- `co`
- `so2`
- `o3`
- `benzene`

The backend:

1. validates that all fields are present
2. converts them to float
3. creates a list of values
4. passes them into all three models
5. returns the predicted AQI values

---

## Backend Prediction Flow

The backend converts input to this structure:

```python
values = [[pm25, pm10, no, no2, nox, nh3, co, so2, o3, benzene]]
```

Then it predicts:

```python
linear_pred = linear_model.predict(values)[0]
rf_pred = rf_model.predict(values)[0]
svm_pred = svm_model.predict(values)[0]
```

Then it returns:

```json
{
  "Linear Regression": 176.55,
  "Random Forest": 380.13,
  "SVM": 150.06
}
```

---

## Pollution Analysis Script Explanation

The file `pollution_analysis.py` is a separate analysis file.

It is not part of the API prediction route.

Its main purpose is to study the dataset visually.

### What It Does

1. loads the AQI dataset
2. prints first rows
3. checks missing values
4. fills missing values
5. creates charts

### Charts Included

- AQI distribution histogram
- PM2.5 vs AQI scatter plot
- PM10 vs AQI scatter plot
- correlation heatmap

---

## Frontend Explanation

The frontend is built using:

- HTML
- CSS
- JavaScript

### Frontend Pages

The current frontend contains:

- `Home`
- `Pollution Analysis`
- `Prediction`
- `Visualization`

### What Each Page Does

## Home Page

- introduces the project
- gives navigation to the other sections
- summarizes main project features

## Pollution Analysis Page

- explains which pollutant features are used
- groups pollutants conceptually
- displays frontend severity bars

## Prediction Page

- contains the AQI prediction form
- sends values to the Flask backend
- displays results from all three models

## Visualization Page

- shows frontend chart-like bars
- compares pollutant levels
- explains AQI categories
- helps presentation and demo flow

---

## Frontend JavaScript Flow

`script.js` handles:

1. page navigation
2. sample data autofill
3. sending prediction requests
4. receiving backend response
5. updating the result UI
6. rendering bar-based visualizations

### Prediction Flow in JavaScript

1. user fills the form
2. JavaScript collects field values
3. it sends a `POST` request to:

```text
http://127.0.0.1:5000/predict
```

4. backend returns JSON
5. frontend displays AQI prediction cards

---

## End-to-End Project Flow

1. dataset is read from `cleaned_aqi_data.csv`
2. each model trains on the same 10 features
3. frontend sends pollutant values to backend
4. backend predicts AQI using all models
5. predictions are shown in the browser

---

## Important Current Limitation

Right now, model files train immediately when imported.

That means:

- backend startup can be slow
- first request can take time

This is acceptable for a simple project, but not ideal for production use.

---

## Suggested Improvement

In the future, models can be:

- trained once
- saved to disk using `pickle` or `joblib`
- loaded directly in `app.py`

This would make the backend much faster to start.

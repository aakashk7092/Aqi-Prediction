# AQI Prediction Project

## Overview
This project predicts **Air Quality Index (AQI)** using three machine learning models:

- `Linear Regression`
- `Random Forest Regressor`
- `Support Vector Regression (SVR / SVM for regression)`

The project also includes:

- a simple **Flask backend API**
- a **frontend dashboard**
- a **pollution analysis script** for basic data visualization

The goal of the project is to take pollution-related input values such as `PM2.5`, `PM10`, `NO2`, `CO`, and others, then estimate the AQI using multiple machine learning approaches.

---

## Project Structure

```text
Aqi-Prediction
|
|-- backend
|   |-- app.py
|   |-- linear_model.py
|   |-- random_forest_model.py
|   |-- svr_model.py
|   |-- pollution_analysis.py
|
|-- data
|   |-- cleaned_aqi_data.csv
|
|-- frontend
|   |-- index.html
|   |-- style.css
|   |-- script.js
|
|-- docs
|   |-- linear_regression_explanation.md
|   |-- random_forest_explanation.md
|   |-- svr_explanation.md
|   |-- backend_and_project_flow.md
|
|-- README.md
```

---

## Detailed Separate Explanation Files

For file-by-file detailed explanations, read:

- [Linear Regression Explanation](./docs/linear_regression_explanation.md)
- [Random Forest Explanation](./docs/random_forest_explanation.md)
- [SVR Explanation](./docs/svr_explanation.md)
- [Backend and Project Flow](./docs/backend_and_project_flow.md)

---

## Dataset Explanation

The dataset file used in this project is:

`data/cleaned_aqi_data.csv`

It contains pollution-related measurements and AQI values.

Important columns in the dataset include:

- `PM2.5`
- `PM10`
- `NO`
- `NO2`
- `NOx`
- `NH3`
- `CO`
- `SO2`
- `O3`
- `Benzene`
- `AQI`

### Input Features Used in the Models

The current models use these 10 input attributes:

- `PM2.5`
- `PM10`
- `NO`
- `NO2`
- `NOx`
- `NH3`
- `CO`
- `SO2`
- `O3`
- `Benzene`

### Target Variable

The target column is:

- `AQI`

This means the models learn the relationship between pollutant values and the final AQI value.

---

## How the Model Files Work

All three model files follow the same simple pipeline:

1. Load the CSV dataset with `pandas`
2. Select important pollution columns as features
3. Select `AQI` as the target
4. Fill missing values using column mean
5. Split the dataset into training and testing data
6. Train the model
7. Predict AQI on test data
8. Print predictions and model accuracy

This same structure is used in:

- [backend/linear_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/linear_model.py)
- [backend/random_forest_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/random_forest_model.py)
- [backend/svr_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/svr_model.py)

---

## Model 1: Linear Regression

### What It Is

Linear Regression is one of the simplest machine learning algorithms.

It assumes that the relationship between input features and target output is approximately linear.

In simple words, it tries to fit a straight mathematical equation like this:

```text
AQI = b0 + b1(PM2.5) + b2(PM10) + b3(NO) + ...
```

Where:

- `b0` is the intercept
- `b1`, `b2`, `b3` are coefficients learned by the model

### How It Works in This Project

In [linear_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/linear_model.py):

1. The model reads the dataset
2. It selects the 10 pollution features
3. It fills missing values using feature means
4. It splits the data into training and testing sets
5. It trains `LinearRegression()`
6. It predicts AQI on test data
7. It prints prediction values and `R2 score`

### Why Use It

- very simple
- fast to train
- easy to understand
- good as a baseline model

### Limitations

- assumes mostly linear relationships
- may not capture complex real-world AQI behavior
- may underperform when pollutant interactions are nonlinear

### Interpretation

Linear Regression is useful as a starting point because it shows whether AQI can be approximated using a direct weighted combination of pollutant values.

---

## Model 2: Random Forest Regressor

### What It Is

Random Forest is an ensemble learning algorithm.

Instead of building one model, it builds **many decision trees**, then combines their predictions.

For regression, the final output is usually the **average** of all tree predictions.

### How It Works in General

1. Multiple random samples are taken from the dataset
2. A decision tree is trained on each sample
3. Each tree makes a prediction
4. The final AQI prediction is the average of all tree outputs

This reduces the weakness of using only one tree.

### How It Works in This Project

In [random_forest_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/random_forest_model.py):

1. The dataset is loaded
2. The same 10 pollutant features are selected
3. Missing values are filled
4. The data is split into train and test sets
5. `RandomForestRegressor(random_state=42)` is trained
6. The model predicts AQI
7. The script prints predictions and `R2 score`

### Why Use It

- handles nonlinear relationships better than linear regression
- usually performs well on tabular data
- more robust to noise
- captures interactions between pollutants

### Limitations

- slower than linear regression
- harder to interpret
- larger memory usage

### Interpretation

Random Forest is often a strong practical model for AQI because pollutant behavior and AQI relationships are not always linear.

---

## Model 3: Support Vector Regression (SVR)

### What It Is

SVR is the regression version of Support Vector Machine.

It tries to fit a function that keeps prediction errors within an acceptable margin while still staying as smooth as possible.

### Main Idea

Instead of trying to make every prediction exactly correct, SVR tries to:

- keep most predictions within a certain tolerance
- ignore very small errors
- focus on important support points in the data

### How It Works in This Project

In [svr_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/svr_model.py):

1. The dataset is loaded
2. The same 10 pollutant attributes are selected
3. Missing values are filled
4. Data is split into training and testing sets
5. `SVR()` is trained
6. The model predicts AQI
7. The script prints predictions and `R2 score`

### Why Use It

- can model more complex relationships than linear regression
- often performs well when the relationship is nonlinear
- good theoretical foundation

### Limitations

- slower on larger datasets
- sensitive to hyperparameters
- harder to explain to beginners

### Interpretation

SVR is useful in AQI prediction because AQI can change in a nonlinear way when multiple pollutants increase together.

---

## Why These Three Models Were Chosen

These three models are useful because they represent three different ways of learning:

- `Linear Regression`: simple linear learning
- `Random Forest`: ensemble tree-based learning
- `SVR`: margin-based nonlinear learning

This gives a good comparison between:

- simple model
- robust practical model
- nonlinear mathematical model

---

## Data Preprocessing Explanation

Before training, the data is prepared in the following way:

### 1. Feature Selection

Only the most relevant pollution columns are used.

```python
X = data[["PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3", "Benzene"]]
```

### 2. Target Selection

```python
y = data["AQI"]
```

### 3. Missing Value Handling

Missing values are replaced by the mean of the column:

```python
X = X.fillna(X.mean())
y = y.fillna(y.mean())
```

This keeps the dataset usable without dropping too many rows.

### 4. Train-Test Split

The dataset is divided into:

- `80% training data`
- `20% testing data`

```python
train_test_split(X, y, test_size=0.2, random_state=42)
```

Training data is used to teach the model.
Testing data is used to check performance on unseen records.

---

## Accuracy Metric Used

The current scripts print:

- `R2 Score`

### R2 Score Explanation

R2 score tells how well the model explains the variation in AQI values.

```text
R2 = 1.0   -> perfect prediction
R2 = 0.0   -> no explanatory power
R2 < 0     -> worse than a very basic baseline
```

In the model files, it is printed like this:

```python
print("Accuracy:", r2_score(y_test, prediction))
```

### Important Note

This project labels `R2 score` as `"Accuracy"` in print statements because that is simple for beginners, but technically it is **not classification accuracy**.

It is better to describe it as:

- `R2 Score`
- `Model Score`
- `Regression Accuracy (R2)`

---

## Backend Explanation

The backend file is:

- [backend/app.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/app.py)

It uses Flask to expose an API endpoint.

### What `app.py` Does

1. Imports the three trained model objects from:
   - `linear_model.py`
   - `random_forest_model.py`
   - `svr_model.py`
2. Starts a Flask app
3. Accepts input values from the frontend
4. Sends the same input to all three models
5. Returns all predictions as JSON

### Main Route

#### `GET /`

Returns backend status information.

#### `POST /predict`

Accepts JSON data in this format:

```json
{
  "pm25": 58.37,
  "pm10": 107.96,
  "no": 0.92,
  "no2": 18.22,
  "nox": 17.15,
  "nh3": 14.5,
  "co": 0.92,
  "so2": 27.64,
  "o3": 77.6225,
  "benzene": 0.0
}
```

The backend converts that input into:

```python
values = [[pm25, pm10, no, no2, nox, nh3, co, so2, o3, benzene]]
```

Then all three models predict:

```python
linear_pred = linear_model.predict(values)[0]
rf_pred = rf_model.predict(values)[0]
svm_pred = svm_model.predict(values)[0]
```

Finally it returns:

```json
{
  "Linear Regression": 176.55,
  "Random Forest": 380.13,
  "SVM": 150.06
}
```

---

## Frontend Explanation

The frontend files are:

- [frontend/index.html](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/index.html)
- [frontend/style.css](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/style.css)
- [frontend/script.js](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/frontend/script.js)

### Frontend Pages

The frontend currently contains:

- `Home page`
- `Pollution Analysis page`
- `Prediction page`
- `Visualization page`

### What the Frontend Does

- lets the user move between pages
- displays project information
- shows pollutant feature explanations
- allows users to input pollution values
- calls the Flask backend
- displays predicted AQI from all three models
- shows dashboard visuals such as trend charts, KPI cards, pollutant mix bars, city ranking, and a live AQI gauge

### New Visual Features Added

The frontend dashboard now includes:

- `overview KPI cards` for AQI, seasonality, and feature coverage
- `AQI trend charts` for monthly movement across the year
- `city comparison lines` for presentation-friendly trend comparison
- `pollutant risk matrix` to highlight pressure zones
- `live AQI gauge` that updates after backend prediction
- `prediction insight cards` for category, model spread, and dominant pollutant
- `pollutant contribution mix` and `hotspot city ranking`

---

## Pollution Analysis Script

The file:

- [backend/pollution_analysis.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/pollution_analysis.py)

is used for basic visualization of the dataset.

### What It Does

1. Loads the AQI dataset
2. Prints dataset preview
3. Checks missing values
4. Fills missing values
5. Draws:
   - AQI distribution histogram
   - PM2.5 vs AQI scatter plot
   - PM10 vs AQI scatter plot
   - correlation heatmap

### Purpose

This script helps understand:

- AQI distribution
- relation between pollutants and AQI
- overall correlations between variables

---

## End-to-End Working Flow

Here is how the complete system works:

1. Dataset is loaded from CSV
2. Three models are trained on pollutant features
3. Frontend takes pollution input from the user
4. Frontend sends input to Flask backend
5. Backend passes the same values to all three models
6. Each model predicts AQI
7. Backend returns JSON response
8. Frontend displays the AQI values

---

## How to Run the Project

## 1. Install Dependencies

```bash
pip install pandas numpy scikit-learn flask matplotlib seaborn
```

## 2. Run a Model File

Example:

```bash
python backend/linear_model.py
python backend/random_forest_model.py
python backend/svr_model.py
```

Each file will:

- train the model
- print predictions
- print R2 score

## 3. Run the Backend

```bash
cd backend
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

## 4. Open the Frontend

Open:

- `frontend/index.html`

Or serve it using a local static server if preferred.

---

## Strengths of This Project

- simple and beginner-friendly structure
- compares three machine learning models
- includes both backend and frontend
- includes analysis and visualization
- good for college project explanation and demo

---

## Limitations

- model files retrain at import time, which makes backend startup slower
- only one metric is printed in model files
- input preprocessing is basic
- feature engineering is minimal
- frontend visualizations are mostly presentation-oriented rather than fully data-driven
- trend and city visuals are sample dashboard views rather than direct live aggregation from the CSV

---

## Suggested Future Improvements

- save trained models using `joblib` or `pickle`
- avoid retraining every time backend starts
- add MAE, RMSE, and MSE metrics
- use scaling for SVR
- add city and date features if needed
- connect visualization page to real dataset summaries
- improve error handling and validation further
- add backend endpoints for live trend aggregation by city and date

---

## Viva / Interview Style Explanation

If someone asks, "How does your project work?", a good short answer is:

> This project predicts AQI using three regression models: Linear Regression, Random Forest, and SVR.  
> First, the dataset is loaded and cleaned. Then pollutant features like PM2.5, PM10, NO2, CO, and others are used to train the models.  
> A Flask backend receives pollution values from the frontend, sends those values to all three models, and returns predicted AQI as JSON.  
> The frontend then shows those results along with analysis and visualization pages.

---

## Author

Aakash Kumar

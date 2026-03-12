# Air Quality Index Prediction - Machine Learning Project

## Overview
This project predicts the Air Quality Index (AQI) using multiple machine learning algorithms.  
It includes a backend API for model predictions and a simple frontend interface to interact with the models and compare results.

---

## Project Structure

```
aqi-prediction
│
├── backend
│   ├── app.py
│   ├── linear_model.py
│   ├── svr_model.py
│   ├── random_forest_model.py
│
├─── data
│   └──cleaned_aqi_data.csv       
│
├─── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├───.gitattribute
├───.gitignore
│
└── README.md
```

---

## Requirements

Install the following before running the project:

- Python 3.9 or higher
- pip

Install required Python libraries:

```
pip install pandas numpy scikit-learn flask joblib
```

---

## Clone the Repository

```
git clone https://github.com/aakashk7092/Machine-Learning-Projects.git
cd Machine-Learning-Projects/aqi-ml-project
```

---

## Run the Project

Open terminal in the project root folder:

```
aqi-ml-project
```

---

## Step 1: Train Machine Learning Models

Run each model training file one by one.

Train Linear Regression

```
python backend/linear_model.py
```

Train Support Vector Regression

```
python backend/svr_model.py
```

Train Random Forest

```
python backend/random_forest_model.py
```

Trained models will be saved inside:

```
backend/models/
```

---

## Step 2: Start Backend API

```
python backend/app.py
```

Backend will run at:

```
http://127.0.0.1:5000
```

---

## Step 3: Start Frontend

Open a new terminal and run:

```
python -m http.server 5500 --directory frontend
```

Frontend will run at:

```
http://127.0.0.1:5500
```

---

## Step 4: Open the Application

Open the following URL in your browser:

```
http://127.0.0.1:5500
```

---

## API Testing (Optional)

Check available models:

```
curl http://127.0.0.1:5000/models
```

Check backend status:

```
curl http://127.0.0.1:5000/
```

---

## Notes

- Keep both backend and frontend terminals running.
- If a model file error appears, retrain that model again.

Example:

```
python backend/random_forest_model.py
```

---

## Machine Learning Models Used

- Linear Regression
- Support Vector Regression (SVR)
- Random Forest Regression

Random Forest is expected to give the best performance for AQI prediction.

---
# Dataset Split

The dataset was split using time-based splitting.

Training Dataset  
2015-01-01 to 2019-11-07  
Total rows: 23624

Testing Dataset  
2019-11-07 to 2020-07-01  
Total rows: 5907

The models are trained using the training data and evaluated on unseen test data.

---

# Machine Learning Models Used

## Linear Regression

Linear Regression is a statistical model that assumes a linear relationship between input features and the target variable.

Example idea:

AQI = b0 + b1x1 + b2x2 + b3x3 + ...

Where:

x = pollutant levels  
b = model coefficients  

Advantages:

- Simple
- Fast
- Easy to interpret

Limitations:

- Cannot capture complex nonlinear patterns.

---

## Support Vector Regression (SVR)

SVR is a machine learning algorithm that tries to fit the best line while allowing some margin of error.

Instead of minimizing prediction errors directly, it tries to keep errors within a specific tolerance range.

Advantages:

- Handles nonlinear relationships
- Good generalization ability

Limitations:

- Slower on large datasets.

---

## Random Forest Regression

Random Forest is an ensemble learning method.

It builds many decision trees and averages their predictions.

Steps:

1. Random samples of the dataset are created.
2. Multiple decision trees are trained.
3. Predictions from all trees are averaged.

Advantages:

- Handles nonlinear relationships
- Reduces overfitting
- Works well on complex datasets

---

# Evaluation Metrics Explained

## Mean Absolute Error (MAE)

MAE measures the average absolute difference between predicted and actual values.

Formula:

MAE = average(|Actual − Predicted|)

Example:

If MAE = 18, the model prediction is off by about 18 AQI units on average.

Lower MAE indicates better accuracy.

---

## Root Mean Squared Error (RMSE)

RMSE measures the square root of the average squared prediction error.

Formula:

RMSE = sqrt(mean((Actual − Predicted)^2))

RMSE penalizes large errors more than MAE.

Lower RMSE indicates better model performance.

---

## R² Score (Coefficient of Determination)

R² measures how well the model explains the variation in AQI values.

Range:

0 = model explains none of the variation  
1 = perfect prediction

Example:

R² = 0.87 means the model explains 87% of AQI variation.

Higher values are better.

---

## Mean Absolute Percentage Error (MAPE)

MAPE measures the percentage difference between predicted and actual values.

Formula:

MAPE = average(|Actual − Predicted| / Actual) × 100

Example:

MAPE = 20% means predictions are off by about 20 percent on average.

Lower values indicate better accuracy.

---

## Median Absolute Error (P50)

This is the median value of absolute prediction errors.

Meaning:

50% of predictions have error less than this value.

This represents the typical prediction error.

---

## P90 Absolute Error

P90 error represents the value below which 90% of prediction errors fall.

Example:

If P90 = 40, then 90% of predictions have error less than 40 AQI units.

This metric helps evaluate worst-case prediction scenarios.

---

# Model Performance Results

## Linear Regression

MAE: 24.360  
RMSE: 35.566  
R²: 0.8151  
MAPE: 23.01%  
Median Absolute Error (P50): 17.43  
P90 Absolute Error: 49.61

---

## Support Vector Regression

MAE: 20.260  
RMSE: 28.923  
R²: 0.8777  
MAPE: 20.19%  
Median Absolute Error (P50): 14.81  
P90 Absolute Error: 42.77

---

## Random Forest Regression

MAE: 18.737  
RMSE: 29.216  
R²: 0.8752  
MAPE: 19.67%  
Median Absolute Error (P50): 12.03  
P90 Absolute Error: 40.85

---

# Stability Check

All models produced valid predictions.

NaN values: 0  
Infinite values: 0

This confirms that all trained models generate stable predictions.

---

# Best Model Selection

Best R² and RMSE  
SVR Model (svr_model.pkl)

Best MAE and typical prediction error  
Random Forest Model (rf_model.pkl)

---

# Final Recommendation

For most real-world use cases, Random Forest is recommended because it produces lower average prediction error and stable predictions.

Default prediction model used in the API:

```
rf_model.pkl
```

Alternative model when maximizing R² performance:

```
svr_model.pkl
```

## Author

Aakash Kumar

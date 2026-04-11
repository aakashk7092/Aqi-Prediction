# Linear Regression Model Explanation

## File

- [backend/linear_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/linear_model.py)

---

## Purpose of This File

This file trains a **Linear Regression** model to predict the `AQI` value from pollution-related input features.

It is the simplest model in the project and works as a good baseline for comparison with the more advanced models.

---

## Code Breakdown

## 1. Import Libraries

```python
import os
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
```

### Why These Libraries Are Used

- `os`
  Used to build the correct file path to the dataset.
- `pandas`
  Used to load and process the CSV file.
- `LinearRegression`
  The machine learning algorithm used for prediction.
- `r2_score`
  Used to measure model performance.
- `train_test_split`
  Used to divide data into training and testing sets.

---

## 2. Build Dataset Path

```python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "cleaned_aqi_data.csv")
```

### Explanation

- `__file__` gives the current file location.
- `os.path.abspath(__file__)` gives the full path of the file.
- `os.path.dirname(...)` gets the backend folder path.
- `os.path.join(...)` builds the path to the CSV file safely.

This makes the script work even if Python is started from a different folder.

---

## 3. Load the Dataset

```python
data = pd.read_csv(DATA_PATH)
```

### Explanation

This line reads the AQI dataset into a pandas DataFrame.

The DataFrame contains rows and columns, where:

- each row is one observation
- each column is one feature or target value

---

## 4. Select Input Features

```python
X = data[["PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3", "Benzene"]]
```

### Explanation

`X` is the input feature matrix.

The model uses these 10 pollutants:

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

These features are chosen because they strongly influence air quality.

---

## 5. Select Target Variable

```python
y = data["AQI"]
```

### Explanation

`y` is the output or target variable.

This is the value the model is trying to predict.

---

## 6. Fill Missing Values

```python
X = X.fillna(X.mean())
y = y.fillna(y.mean())
```

### Explanation

If any feature value is missing, it is replaced with the mean of that column.

This is a simple preprocessing step that prevents training from failing due to null values.

Example:

- if `PM10` has missing values
- the missing values are replaced by average `PM10`

---

## 7. Split Data into Train and Test Sets

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Explanation

This divides the data into:

- `80% training data`
- `20% testing data`

Why this is important:

- training data teaches the model
- testing data checks how well the model works on unseen data

`random_state=42` ensures the split is reproducible.

---

## 8. Create the Model

```python
model = LinearRegression()
```

### Explanation

This creates the Linear Regression object.

Linear Regression tries to find the best equation:

```text
AQI = b0 + b1x1 + b2x2 + b3x3 + ...
```

Where:

- `x1, x2, x3` are the pollution features
- `b1, b2, b3` are learned coefficients

---

## 9. Train the Model

```python
model.fit(X_train, y_train)
```

### Explanation

The model learns patterns from the training data.

It calculates:

- the intercept
- the coefficient for each feature

These values are chosen so that prediction error becomes as small as possible.

---

## 10. Predict on Test Data

```python
prediction = model.predict(X_test)
```

### Explanation

The model now uses learned coefficients to predict AQI values for test records.

These predictions are compared with actual `y_test` values.

---

## 11. Print Results

```python
print("Linear Regression Prediction")
print(prediction)
print("Accuracy:", r2_score(y_test, prediction))
```

### Explanation

This prints:

- all predicted AQI values for the test set
- the `R2 Score`

The printed word is `"Accuracy"`, but technically this is **R2 score**, not classification accuracy.

---

## How Linear Regression Works Conceptually

Linear Regression assumes that AQI changes in a mostly linear way with pollutant values.

That means:

- if pollutant value increases
- AQI may increase by some learned amount

Each feature gets a weight.

Example idea:

```text
AQI = 12 + 1.4(PM2.5) + 0.8(PM10) + 2.1(NO2) + ...
```

This is not the exact equation from the model, but it shows the idea.

---

## Strengths of Linear Regression

- simple and easy to understand
- very fast to train
- useful baseline model
- coefficients are interpretable

---

## Limitations of Linear Regression

- assumes linear relationships
- cannot model complex nonlinear interactions well
- may underperform on real AQI behavior

---

## Why It Is Important in This Project

Even if it is not always the best-performing model, Linear Regression is useful because:

- it gives a baseline for comparison
- it is easy to explain in a viva or project review
- it helps show whether AQI can be approximated using direct weighted pollutant relationships

---

## Short Viva Explanation

> The Linear Regression model predicts AQI by learning a straight-line mathematical relationship between pollutant values and AQI. It uses ten pollution features, fills missing values with column means, trains on 80% of the dataset, tests on 20%, and evaluates performance using R2 score.

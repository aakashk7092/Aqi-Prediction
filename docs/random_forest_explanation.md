# Random Forest Model Explanation

## File

- [backend/random_forest_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/random_forest_model.py)

---

## Purpose of This File

This file trains a **Random Forest Regressor** to predict AQI values.

Random Forest is more advanced than Linear Regression because it can capture nonlinear patterns and interactions between pollutant features.

---

## Code Breakdown

## 1. Import Libraries

```python
import os
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
```

### Why These Libraries Are Used

- `os`
  For building the dataset path.
- `pandas`
  For loading and handling the CSV file.
- `RandomForestRegressor`
  The machine learning algorithm used for regression.
- `r2_score`
  Used to measure model quality.
- `train_test_split`
  Used to divide data into train and test sets.

---

## 2. Build Dataset Path

```python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "cleaned_aqi_data.csv")
```

### Explanation

This makes the data path stable and independent of where the script is run from.

---

## 3. Load the Dataset

```python
data = pd.read_csv(DATA_PATH)
```

### Explanation

The AQI dataset is loaded into a pandas DataFrame.

---

## 4. Select Input Features

```python
X = data[["PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3", "Benzene"]]
```

### Explanation

These are the 10 pollutant inputs used for prediction.

They represent the independent variables that influence AQI.

---

## 5. Select Target

```python
y = data["AQI"]
```

### Explanation

The target variable is AQI, which the model must predict.

---

## 6. Fill Missing Values

```python
X = X.fillna(X.mean())
y = y.fillna(y.mean())
```

### Explanation

Missing values are filled with mean values so the model can train without errors.

---

## 7. Split the Dataset

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Explanation

The dataset is divided into:

- 80% for training
- 20% for testing

This helps evaluate how well the model generalizes to unseen data.

---

## 8. Create the Random Forest Model

```python
model = RandomForestRegressor(random_state=42)
```

### Explanation

This creates the Random Forest model.

Random Forest is called a forest because it contains many decision trees.

Each tree learns from the data in a slightly different way.

---

## 9. Train the Model

```python
model.fit(X_train, y_train)
```

### Explanation

During training:

1. the model creates many decision trees
2. each tree sees random samples of the training data
3. each tree learns split rules such as:
   - if `PM2.5` is high and `NO2` is high, AQI may be high
   - if `CO` is low and `O3` is moderate, AQI may be moderate

This allows the model to learn complex patterns.

---

## 10. Predict AQI

```python
prediction = model.predict(X_test)
```

### Explanation

Each tree predicts AQI for a test sample.

Then Random Forest averages those predictions to produce the final AQI value.

---

## 11. Print Results

```python
print("Random Forest Prediction")
print(prediction)
print("Accuracy:", r2_score(y_test, prediction))
```

### Explanation

This prints:

- predicted AQI values
- the R2 score

Again, the label says `"Accuracy"` for simplicity, but technically it is regression `R2 score`.

---

## How Random Forest Works Conceptually

Random Forest is an **ensemble model**.

That means it combines many simple models to build a stronger final model.

### Main Idea

Instead of trusting one decision tree, it:

1. builds many trees
2. gets many predictions
3. averages them

This reduces overfitting and improves stability.

### Example Concept

Imagine:

- tree 1 predicts AQI = 220
- tree 2 predicts AQI = 240
- tree 3 predicts AQI = 230

The final prediction may be around:

```text
AQI = (220 + 240 + 230) / 3 = 230
```

This averaging makes Random Forest more robust.

---

## Strengths of Random Forest

- handles nonlinear relationships well
- captures feature interactions
- works strongly on tabular data
- less likely to overfit than one decision tree
- often gives strong practical performance

---

## Limitations of Random Forest

- slower than Linear Regression
- harder to interpret
- uses more memory
- model internals are less transparent

---

## Why It Is Important in This Project

AQI does not always change in a perfectly linear way.

Many pollutants can interact together.

Random Forest is valuable here because:

- it can model those interactions
- it usually performs better than simple linear models
- it is often one of the strongest choices for structured air-quality datasets

---

## Short Viva Explanation

> Random Forest predicts AQI by training many decision trees and averaging their outputs. It uses the same ten pollution input features as the other models, but it can capture nonlinear relationships better than Linear Regression, which makes it a strong model for AQI prediction.

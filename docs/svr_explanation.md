# Support Vector Regression (SVR) Model Explanation

## File

- [backend/svr_model.py](/c:/Users/aakas/OneDrive/Desktop/AQI%20Project/Aqi-Prediction/backend/svr_model.py)

---

## Purpose of This File

This file trains a **Support Vector Regression (SVR)** model to predict AQI.

SVR is the regression form of Support Vector Machine.

It is useful when the relationship between pollution features and AQI is more complex and not purely linear.

---

## Code Breakdown

## 1. Import Libraries

```python
import os
import pandas as pd
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
```

### Why These Libraries Are Used

- `os`
  Used to create the correct dataset path.
- `pandas`
  Used to load and manage the dataset.
- `r2_score`
  Used to evaluate model performance.
- `train_test_split`
  Used to split the dataset.
- `SVR`
  The Support Vector Regression model.

---

## 2. Build Dataset Path

```python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "cleaned_aqi_data.csv")
```

### Explanation

This builds a stable path to the CSV file.

---

## 3. Load Dataset

```python
data = pd.read_csv(DATA_PATH)
```

### Explanation

This reads the AQI dataset into a DataFrame.

---

## 4. Select Input Features

```python
X = data[["PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3", "Benzene"]]
```

### Explanation

These 10 pollutant features are the inputs used by the model.

---

## 5. Select Target Value

```python
y = data["AQI"]
```

### Explanation

`AQI` is the output value the model tries to predict.

---

## 6. Handle Missing Values

```python
X = X.fillna(X.mean())
y = y.fillna(y.mean())
```

### Explanation

Missing values are replaced by average values.

This avoids errors during model training.

---

## 7. Train-Test Split

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Explanation

The dataset is divided into:

- training set
- testing set

The model learns from training data and is checked using test data.

---

## 8. Create the SVR Model

```python
model = SVR()
```

### Explanation

This creates the Support Vector Regression model.

SVR tries to fit a function that keeps most prediction errors within a certain margin.

It does not focus on making every point exactly correct.

Instead, it tries to create a prediction boundary that is smooth and generalizes well.

---

## 9. Train the Model

```python
model.fit(X_train, y_train)
```

### Explanation

During training, SVR finds:

- support vectors
- a regression function
- a margin of tolerance

The support vectors are the most important points that influence the final model.

---

## 10. Predict AQI

```python
prediction = model.predict(X_test)
```

### Explanation

The model uses the learned regression function to estimate AQI values on test data.

---

## 11. Print Results

```python
print("SVM Prediction")
print(prediction)
print("Accuracy:", r2_score(y_test, prediction))
```

### Explanation

This prints:

- predicted AQI values
- the `R2 score`

Again, the printed word `"Accuracy"` is just a simple label, but this metric is actually regression `R2 score`.

---

## How SVR Works Conceptually

SVR tries to find a regression line or curve with a margin around it.

### Main Idea

It does not worry about tiny errors if they stay inside the allowed margin.

It mainly focuses on points outside the margin and on support vectors.

### Why This Is Useful

AQI patterns are often nonlinear.

For example:

- a small increase in one pollutant may have little effect
- but multiple pollutants increasing together may sharply change AQI

SVR can model this better than a simple straight-line model in many situations.

---

## Strengths of SVR

- handles nonlinear relationships better than Linear Regression
- often performs well on complex patterns
- based on strong mathematical principles

---

## Limitations of SVR

- slower on larger datasets
- sensitive to scaling and hyperparameter choices
- harder to explain than Linear Regression
- may be computationally expensive

---

## Why It Is Important in This Project

SVR is included because AQI prediction may involve nonlinear interactions among pollutants.

It helps compare:

- a simple linear model
- a nonlinear margin-based model
- a tree-based ensemble model

This makes the project stronger from a machine learning comparison point of view.

---

## Short Viva Explanation

> SVR predicts AQI by learning a smooth regression function that keeps most prediction errors within a small tolerance margin. It is useful when AQI does not depend on pollutants in a purely linear way, so it helps capture more complex patterns than Linear Regression.

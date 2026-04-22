import os

import pandas as pd
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "cleaned_aqi_data.csv")

# load dataset
data = pd.read_csv(DATA_PATH)

# features
X = data[["PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3", "Benzene"]]

# target
y = data["AQI"]

# split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# model
model = SVR()

#scaling

model = Pipeline([
    ("scaler", RobustScaler()),
    ("regressor", SVR())
])

#train

model = SVR()
model.fit(X_train, y_train)

#predict

prediction = model.predict(X_test)

print("SVM Prediction")
print(prediction)
print("R2 Score:", r2_score(y_test, prediction))

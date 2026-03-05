Air Quality Index Prediction - Machine Learning Project

This project predicts the Air Quality Index (AQI) using multiple Machine Learning algorithms.
It includes a backend API for model predictions and a simple frontend interface to interact with the models and compare results.

Project Structure
aqi-ml-project
│
├── backend
│   ├── app.py
│   ├── linear_model.py
│   ├── svr_model.py
│   ├── random_forest_model.py
│   ├── dataset
│   │     └── aqi_data.csv
│   └── models
│         ├── linear_model.pkl
│         ├── svr_model.pkl
│         └── random_forest_model.pkl
│
├── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
Requirements

Install the following before running the project:

Python 3.9 or higher

pip

Install required Python libraries:

pip install pandas numpy scikit-learn flask joblib
Clone the Repository
git clone https://github.com/aakashk7092/Machine-Learning-Projects.git
cd Machine-Learning-Projects/aqi-ml-project
Run the Project

Open terminal in the root folder

C:\Users\aakas\OneDrive\Desktop\aqi-prection\aqi-ml-project
Step 1: Train Machine Learning Models

Run each model training file one by one.

Train Linear Regression model

python backend/linear_model.py

Train Support Vector Regression model

python backend/svr_model.py

Train Random Forest model

python backend/random_forest_model.py

These commands will create trained model files inside:

backend/models/
Step 2: Start Backend API

Run the backend server:

python backend/app.py

Backend will run on:

http://127.0.0.1:5000
Step 3: Start Frontend

Open a new terminal and run:

python -m http.server 5500 --directory frontend

Frontend will run on:

http://127.0.0.1:5500
Step 4: Open the Application

Open the following URL in your browser:

http://127.0.0.1:5500
API Testing (Optional)

Check available models:

curl http://127.0.0.1:5000/models

Check backend status:

curl http://127.0.0.1:5000/
Notes

Keep both backend and frontend terminals running.

If a model file error appears, retrain that model again.

Example:

python backend/random_forest_model.py
Machine Learning Models Used

Linear Regression

Support Vector Regression (SVR)

Random Forest Regression

Random Forest is expected to give the best performance for AQI prediction.

Author

Aakash Kumar

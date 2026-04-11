import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# load dataset
data = pd.read_csv("../data/cleaned_aqi_data.csv")

# show data
print(data.head())

# check missing values
print(data.isnull().sum())

# fill missing values
data = data.fillna(data.mean())

# ==========================
# AQI Distribution
# ==========================
plt.hist(data['AQI'])
plt.title("AQI Distribution")
plt.xlabel("AQI")
plt.ylabel("Count")
plt.show()


# ==========================
# PM2.5 vs AQI
# ==========================
plt.scatter(data['PM2.5'], data['AQI'])
plt.title("PM2.5 vs AQI")
plt.xlabel("PM2.5")
plt.ylabel("AQI")
plt.show()


# ==========================
# PM10 vs AQI
# ==========================
plt.scatter(data['PM10'], data['AQI'])
plt.title("PM10 vs AQI")
plt.xlabel("PM10")
plt.ylabel("AQI")
plt.show()


# ==========================
# Correlation Heatmap
# ==========================
sns.heatmap(data.corr())
plt.title("Correlation Heatmap")
plt.show()
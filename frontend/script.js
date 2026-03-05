const form = document.getElementById("aqi-form");
const resultPanel = document.getElementById("result-panel");
const mainAqi = document.getElementById("main-aqi");
const aqiBadge = document.getElementById("aqi-badge");
const healthMessage = document.getElementById("health-message");
const comparisonCards = document.getElementById("comparison-cards");
const compareAll = document.getElementById("compare_all");
const sampleBtn = document.getElementById("sample-btn");
const submitBtn = document.getElementById("submit-btn");

const API_BASE = "http://127.0.0.1:5000";

const CATEGORY_COLORS = {
  Good: "#1a8f39",
  Satisfactory: "#148a7f",
  Moderate: "#bf8d1a",
  Poor: "#ce6f1d",
  "Very Poor": "#c74a36",
  Severe: "#b3262e",
};

function setBadge(category) {
  const color = CATEGORY_COLORS[category] || "#355";
  aqiBadge.textContent = category || "Unknown";
  aqiBadge.style.color = color;
  aqiBadge.style.borderColor = color;
  aqiBadge.style.background = `${color}1A`;
}

function cardHtml(name, value) {
  return `<article class="model-card"><p>${name}</p><h3>${value}</h3></article>`;
}

function normalizePayload() {
  return {
    City: document.getElementById("city").value.trim(),
    Date: document.getElementById("date").value.trim(),
    model_name: document.getElementById("model_name").value,
    "PM2.5": parseFloat(document.getElementById("pm25").value),
    PM10: parseFloat(document.getElementById("pm10").value),
    NO: parseFloat(document.getElementById("no").value),
    NO2: parseFloat(document.getElementById("no2").value),
    NOx: parseFloat(document.getElementById("nox").value),
    NH3: parseFloat(document.getElementById("nh3").value),
    SO2: parseFloat(document.getElementById("so2").value),
    CO: parseFloat(document.getElementById("co").value),
    O3: parseFloat(document.getElementById("o3").value),
    Benzene: parseFloat(document.getElementById("benzene").value),
    Toluene: parseFloat(document.getElementById("toluene").value),
  };
}

function validatePayload(payload) {
  const invalid = Object.entries(payload).find(([key, value]) => {
    if (key === "City" || key === "Date" || key === "model_name") {
      return value === "";
    }
    return Number.isNaN(value) || value < 0;
  });

  if (!invalid) {
    return null;
  }
  return `Invalid value for ${invalid[0]}.`;
}

sampleBtn.addEventListener("click", () => {
  document.getElementById("city").value = "Delhi";
  document.getElementById("date").value = "15-03-2026";
  document.getElementById("pm25").value = 25;
  document.getElementById("pm10").value = 45;
  document.getElementById("no").value = 21;
  document.getElementById("no2").value = 12;
  document.getElementById("nox").value = 21;
  document.getElementById("nh3").value = 44;
  document.getElementById("co").value = 21;
  document.getElementById("so2").value = 12;
  document.getElementById("o3").value = 12;
  document.getElementById("benzene").value = 0;
  document.getElementById("toluene").value = 0;
});

form.addEventListener("reset", () => {
  resultPanel.classList.add("hidden");
  comparisonCards.innerHTML = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Predicting...";

  const payload = normalizePayload();
  const validationError = validatePayload(payload);
  if (validationError) {
    resultPanel.classList.remove("hidden");
    mainAqi.textContent = "--";
    healthMessage.textContent = validationError;
    comparisonCards.innerHTML = "";
    setBadge("Unknown");
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict AQI";
    return;
  }

  try {
    const url = compareAll.checked ? `${API_BASE}/predict_all` : `${API_BASE}/predict`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      resultPanel.classList.remove("hidden");
      mainAqi.textContent = "--";
      healthMessage.textContent = `Error: ${data.error || "Something went wrong"}`;
      comparisonCards.innerHTML = "";
      setBadge("Unknown");
      return;
    }

    resultPanel.classList.remove("hidden");
    if (compareAll.checked) {
      mainAqi.textContent = data.average_aqi;
      setBadge(data.aqi_category);
      healthMessage.textContent = `${data.health_message} (Average of all models)`;
      comparisonCards.innerHTML = Object.entries(data.predictions)
        .map(([name, value]) => cardHtml(name, value))
        .join("");
    } else {
      mainAqi.textContent = data.predicted_aqi;
      setBadge(data.aqi_category);
      healthMessage.textContent = `${data.model}: ${data.health_message}`;
      comparisonCards.innerHTML = cardHtml(data.model, data.predicted_aqi);
    }
  } catch (error) {
    resultPanel.classList.remove("hidden");
    mainAqi.textContent = "--";
    setBadge("Unknown");
    comparisonCards.innerHTML = "";
    healthMessage.textContent = `Request failed: ${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict AQI";
  }
});

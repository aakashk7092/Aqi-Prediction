const form = document.getElementById("aqi-form");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    City: document.getElementById("city").value.trim(),
    Date: document.getElementById("date").value.trim(),
    model_name: document.getElementById("model_name").value,
    "PM2.5": parseFloat(document.getElementById("pm25").value),
    "PM10": parseFloat(document.getElementById("pm10").value),
    "NO": parseFloat(document.getElementById("no").value),
    "NO2": parseFloat(document.getElementById("no2").value),
    "NOx": parseFloat(document.getElementById("nox").value),
    "NH3": parseFloat(document.getElementById("nh3").value),
    "SO2": parseFloat(document.getElementById("so2").value),
    "CO": parseFloat(document.getElementById("co").value),
    "O3": parseFloat(document.getElementById("o3").value),
    "Benzene": parseFloat(document.getElementById("benzene").value),
    "Toluene": parseFloat(document.getElementById("toluene").value),
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      result.textContent = `Error: ${data.error || "Something went wrong"}`;
      return;
    }

    result.textContent = `Predicted AQI (${data.model}): ${data.predicted_aqi}`;
  } catch (error) {
    result.textContent = `Request failed: ${error.message}`;
  }
});

const form = document.getElementById("aqi-form");
const resultPanel = document.getElementById("result-panel");
const mainAqi = document.getElementById("main-aqi");
const aqiBadge = document.getElementById("aqi-badge");
const healthMessage = document.getElementById("health-message");
const comparisonCards = document.getElementById("comparison-cards");
const summaryStats = document.getElementById("summary-stats");
const chartSection = document.getElementById("chart-section");
const barChart = document.getElementById("bar-chart");
const compareAll = document.getElementById("compare_all");
const sampleBtn = document.getElementById("sample-btn");
const submitBtn = document.getElementById("submit-btn");
const historyBody = document.getElementById("history-body");
const downloadHistoryBtn = document.getElementById("download-history");
const clearHistoryBtn = document.getElementById("clear-history");
const trendChart = document.getElementById("trend-chart");
const trendMin = document.getElementById("trend-min");
const trendMax = document.getElementById("trend-max");
const trendLast = document.getElementById("trend-last");
const insightSection = document.getElementById("insight-section");
const riskFill = document.getElementById("risk-fill");
const riskText = document.getElementById("risk-text");
const topPollutantsList = document.getElementById("top-pollutants");
const recommendationsList = document.getElementById("recommendations");
const scenarioShift = document.getElementById("scenario-shift");
const scenarioLabel = document.getElementById("scenario-label");
const runScenarioBtn = document.getElementById("run-scenario");
const scenarioResult = document.getElementById("scenario-result");

const API_BASE = "http://127.0.0.1:5000";
const HISTORY_KEY = "aqi_prediction_history_v1";

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

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function writeHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
}

function renderHistory() {
  const items = readHistory();
  if (!items.length) {
    historyBody.innerHTML = `<tr><td colspan="5">No predictions yet.</td></tr>`;
    renderTrendChart([]);
    return;
  }
  historyBody.innerHTML = items
    .map(
      (item) => `<tr>
        <td>${item.time}</td>
        <td>${item.city}</td>
        <td>${item.mode}</td>
        <td>${item.aqi}</td>
        <td>${item.category}</td>
      </tr>`
    )
    .join("");
  renderTrendChart(items);
}

function pushHistory(entry) {
  const list = readHistory();
  list.unshift(entry);
  writeHistory(list);
  renderHistory();
}

function renderTrendChart(items) {
  if (!items.length) {
    trendChart.innerHTML = "";
    trendMin.textContent = "Min: --";
    trendMax.textContent = "Max: --";
    trendLast.textContent = "Latest: --";
    return;
  }

  const ordered = [...items].reverse();
  const values = ordered.map((i) => Number(i.aqi));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const width = 640;
  const height = 220;
  const padding = 24;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = values.map((value, idx) => {
    const x = padding + (idx / Math.max(1, values.length - 1)) * chartW;
    const y = padding + ((max - value) / range) * chartH;
    return { x, y, value };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M ${padding} ${height - padding} L ${polyline} L ${padding + chartW} ${height - padding} Z`;

  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((r) => {
      const y = padding + r * chartH;
      return `<line x1="${padding}" y1="${y}" x2="${padding + chartW}" y2="${y}" stroke="#e5eefb" stroke-width="1" />`;
    })
    .join("");

  const circles = points
    .map(
      (p) =>
        `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#2f6ecf"><title>AQI ${p.value}</title></circle>`
    )
    .join("");

  trendChart.innerHTML = `
    ${grid}
    <path d="${areaPath}" fill="#2f6ecf22"></path>
    <polyline points="${polyline}" fill="none" stroke="#2f6ecf" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${circles}
  `;

  trendMin.textContent = `Min: ${min.toFixed(2)}`;
  trendMax.textContent = `Max: ${max.toFixed(2)}`;
  trendLast.textContent = `Latest: ${values[values.length - 1].toFixed(2)}`;
}

function renderBarChart(predictions) {
  const entries = Object.entries(predictions);
  if (!entries.length) {
    barChart.innerHTML = "";
    chartSection.classList.add("hidden");
    return;
  }
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);
  barChart.innerHTML = entries
    .map(([name, value]) => {
      const width = Math.max(4, (value / maxValue) * 100);
      return `<div class="bar-row">
        <span class="bar-label">${name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
        <span class="bar-value">${value}</span>
      </div>`;
    })
    .join("");
  chartSection.classList.remove("hidden");
}

function renderStats(predictions) {
  const values = Object.values(predictions);
  if (!values.length) {
    summaryStats.innerHTML = "";
    summaryStats.classList.add("hidden");
    return;
  }
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const spread = (maxVal - minVal).toFixed(2);
  summaryStats.innerHTML = [
    `Min AQI: ${minVal.toFixed(2)}`,
    `Max AQI: ${maxVal.toFixed(2)}`,
    `Spread: ${spread}`,
  ]
    .map((s) => `<span class="stat-chip">${s}</span>`)
    .join("");
  summaryStats.classList.remove("hidden");
}

function renderInsights(data) {
  if (!data) {
    insightSection.classList.add("hidden");
    return;
  }
  insightSection.classList.remove("hidden");

  const risk = Number(data.risk_score || 0);
  riskFill.style.width = `${Math.max(0, Math.min(100, risk))}%`;
  riskText.textContent = `${risk.toFixed(2)}/100`;

  topPollutantsList.innerHTML = (data.top_pollutants || [])
    .map(
      (p) =>
        `<li><strong>${p.name}</strong>: ${p.value} (limit ${p.limit}, ratio ${p.ratio})</li>`
    )
    .join("");

  recommendationsList.innerHTML = (data.recommendations || [])
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function resetAdvancedPanels() {
  comparisonCards.innerHTML = "";
  summaryStats.innerHTML = "";
  barChart.innerHTML = "";
  summaryStats.classList.add("hidden");
  chartSection.classList.add("hidden");
  insightSection.classList.add("hidden");
  scenarioResult.classList.add("hidden");
  scenarioResult.textContent = "";
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

scenarioShift.addEventListener("input", () => {
  const value = Number(scenarioShift.value);
  scenarioLabel.textContent = `${value >= 0 ? "+" : ""}${value}%`;
});

form.addEventListener("reset", () => {
  resultPanel.classList.add("hidden");
  resetAdvancedPanels();
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
    resetAdvancedPanels();
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
      resetAdvancedPanels();
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
      renderStats(data.predictions);
      renderBarChart(data.predictions);
      renderInsights(data);
      pushHistory({
        time: new Date().toLocaleString(),
        city: payload.City,
        mode: "Compare All",
        aqi: data.average_aqi,
        category: data.aqi_category,
      });
    } else {
      mainAqi.textContent = data.predicted_aqi;
      setBadge(data.aqi_category);
      healthMessage.textContent = `${data.model}: ${data.health_message}`;
      comparisonCards.innerHTML = cardHtml(data.model, data.predicted_aqi);
      renderStats({ [data.model]: data.predicted_aqi });
      renderBarChart({ [data.model]: data.predicted_aqi });
      renderInsights(data);
      pushHistory({
        time: new Date().toLocaleString(),
        city: payload.City,
        mode: data.model,
        aqi: data.predicted_aqi,
        category: data.aqi_category,
      });
    }
  } catch (error) {
    resultPanel.classList.remove("hidden");
    mainAqi.textContent = "--";
    setBadge("Unknown");
    resetAdvancedPanels();
    healthMessage.textContent = `Request failed: ${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict AQI";
  }
});

downloadHistoryBtn.addEventListener("click", () => {
  const items = readHistory();
  if (!items.length) {
    return;
  }
  const esc = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const csv = [
    "time,city,mode,aqi,category",
    ...items.map((i) => [i.time, i.city, i.mode, i.aqi, i.category].map(esc).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "aqi_prediction_history.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

runScenarioBtn.addEventListener("click", async () => {
  const payload = normalizePayload();
  const validationError = validatePayload(payload);
  if (validationError) {
    scenarioResult.classList.remove("hidden");
    scenarioResult.textContent = validationError;
    return;
  }

  const shiftPercent = Number(scenarioShift.value);
  const factor = 1 + shiftPercent / 100;
  const scenarioPayload = { ...payload };
  [
    "PM2.5",
    "PM10",
    "NO",
    "NO2",
    "NOx",
    "NH3",
    "CO",
    "SO2",
    "O3",
    "Benzene",
    "Toluene",
  ].forEach((field) => {
    scenarioPayload[field] = Number((scenarioPayload[field] * factor).toFixed(3));
  });

  runScenarioBtn.disabled = true;
  runScenarioBtn.textContent = "Running...";
  try {
    const [baseRes, scenarioRes] = await Promise.all([
      fetch(`${API_BASE}/predict_all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      fetch(`${API_BASE}/predict_all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenarioPayload),
      }),
    ]);

    const baseData = await baseRes.json();
    const scenarioData = await scenarioRes.json();
    if (!baseRes.ok || !scenarioRes.ok) {
      throw new Error(baseData.error || scenarioData.error || "Scenario failed");
    }

    const delta = Number((scenarioData.average_aqi - baseData.average_aqi).toFixed(2));
    scenarioResult.classList.remove("hidden");
    scenarioResult.innerHTML =
      `Base AQI: <strong>${baseData.average_aqi}</strong> | ` +
      `Scenario AQI: <strong>${scenarioData.average_aqi}</strong> | ` +
      `Change: <strong>${delta >= 0 ? "+" : ""}${delta}</strong>`;
  } catch (error) {
    scenarioResult.classList.remove("hidden");
    scenarioResult.textContent = `Scenario error: ${error.message}`;
  } finally {
    runScenarioBtn.disabled = false;
    runScenarioBtn.textContent = "Run Scenario";
  }
});

renderHistory();

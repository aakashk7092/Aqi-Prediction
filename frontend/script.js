const API_URL = "https://aqi-prediction-d8il.onrender.com/predict";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const pages = {
  home: document.getElementById("home-page"),
  analysis: document.getElementById("analysis-page"),
  prediction: document.getElementById("prediction-page"),
  visualization: document.getElementById("visualization-page"),
};
const sidebar = document.querySelector(".sidebar");
const navToggle = document.getElementById("nav-toggle");
const navLinks     = document.querySelectorAll(".nav-link");
const jumpButtons  = document.querySelectorAll(".jump-button");
const predictionForm = document.getElementById("prediction-form");
const sampleButton   = document.getElementById("sample-button");
const resultBox      = document.getElementById("result-box");
const severityBars   = document.getElementById("severity-bars");
const pollutionChart = document.getElementById("pollution-chart");
const modelChart     = document.getElementById("model-chart");
const overviewKpis   = document.getElementById("overview-kpis");
const homeTrendPeak  = document.getElementById("home-trend-peak");
const homeTrendChart = document.getElementById("home-trend-chart");
const cityTrendChart = document.getElementById("city-trend-chart");
const riskMatrix     = document.getElementById("risk-matrix");
const pollutantMix   = document.getElementById("pollutant-mix");
const cityRanking    = document.getElementById("city-ranking");
const gauge          = document.getElementById("aqi-gauge");
const gaugeValue     = document.getElementById("gauge-value");
const gaugeLabel     = document.getElementById("gauge-label");
const predictionSummary = document.getElementById("prediction-summary");
const predictionCards = document.getElementById("prediction-cards");
const bestModelCard = document.getElementById("best-model-card");
const accuracyChart = document.getElementById("accuracy-chart");
const actualPredictedChart = document.getElementById("actual-predicted-chart");
const actualPredictedLegend = document.getElementById("actual-predicted-legend");
const actualPredictedTooltip = document.getElementById("actual-predicted-tooltip");
const predictionVisualTitle = document.getElementById("prediction-visual-title");
const predictionVisualAqi = document.getElementById("prediction-visual-aqi");
const predictionVisualCategory = document.getElementById("prediction-visual-category");
const predictionVisualDriver = document.getElementById("prediction-visual-driver");

// ── Static data ───────────────────────────────────────────────────────────────
const severityData = [
  { label: "Low Pollution Pressure",      value: 30 },
  { label: "Moderate Pollution Pressure", value: 60 },
  { label: "High Pollution Pressure",     value: 90 },
];

const pollutionData = [
  { label: "PM2.5", value: 82 },
  { label: "PM10",  value: 68 },
  { label: "NO2",   value: 54 },
  { label: "SO2",   value: 34 },
  { label: "CO",    value: 46 },
  { label: "O3",    value: 58 },
];

const monthlyTrendData = [
  { label: "Jan", value: 286 }, { label: "Feb", value: 268 },
  { label: "Mar", value: 244 }, { label: "Apr", value: 208 },
  { label: "May", value: 189 }, { label: "Jun", value: 162 },
  { label: "Jul", value: 138 }, { label: "Aug", value: 129 },
  { label: "Sep", value: 151 }, { label: "Oct", value: 211 },
  { label: "Nov", value: 258 }, { label: "Dec", value: 279 },
];

const citySeries = [
  { name: "Delhi",     color: "#114b46", values: [320,298,271,238,214,184,160,149,190,268,314,336] },
  { name: "Ahmedabad", color: "#d18642", values: [285,274,248,215,194,168,144,138,162,223,266,281] },
  { name: "Bengaluru", color: "#3a8d7d", values: [162,154,148,132,121,110, 94, 91,105,128,141,153] },
];

const pollutantContributionData = [
  { label: "Particulate Matter",  value: 42, color: "#114b46" },
  { label: "Nitrogen Pollutants", value: 24, color: "#d18642" },
  { label: "Gas Pollutants",      value: 19, color: "#3a8d7d" },
  { label: "Organic Compounds",   value: 15, color: "#7ca982" },
];

const hotspotCities = [
  { city: "Delhi",      average: 262, trend: "Severe winter spikes" },
  { city: "Ahmedabad",  average: 225, trend: "Persistent particulate load" },
  { city: "Kanpur",     average: 214, trend: "Urban industrial pressure" },
  { city: "Lucknow",    average: 198, trend: "Moderate to poor spread" },
];

const pollutantRiskRows    = [
  { label: "PM2.5", values: [92, 84, 73, 88] },
  { label: "PM10",  values: [86, 79, 69, 83] },
  { label: "NO2",   values: [58, 63, 52, 61] },
  { label: "SO2",   values: [34, 41, 29, 36] },
  { label: "O3",    values: [48, 54, 46, 51] },
];
const pollutantRiskColumns = ["North", "West", "South", "Central"];

// NEW datasets
const radarData = [
  { label: "PM2.5",   value: 0.82, color: "#114b46" },
  { label: "PM10",    value: 0.68, color: "#0f766e" },
  { label: "NO2",     value: 0.54, color: "#3a8d7d" },
  { label: "SO2",     value: 0.34, color: "#7ca982" },
  { label: "O3",      value: 0.58, color: "#c69b4d" },
  { label: "CO",      value: 0.46, color: "#d18642" },
  { label: "NOx",     value: 0.60, color: "#ca6f4c" },
  { label: "Benzene", value: 0.29, color: "#9b3d31" },
];

const correlationData = [
  { label: "PM2.5",   corr: 0.91, color: "#114b46" },
  { label: "PM10",    corr: 0.87, color: "#0f766e" },
  { label: "NO2",     corr: 0.74, color: "#3a8d7d" },
  { label: "NOx",     corr: 0.71, color: "#7ca982" },
  { label: "SO2",     corr: 0.63, color: "#c69b4d" },
  { label: "O3",      corr: 0.58, color: "#d18642" },
  { label: "CO",      corr: 0.52, color: "#ca6f4c" },
  { label: "NH3",     corr: 0.44, color: "#9b3d31" },
  { label: "NO",      corr: 0.41, color: "#6b5b3e" },
  { label: "Benzene", corr: 0.35, color: "#888" },
];

const seasonData = [
  { season: "Winter", months: "Nov–Feb", aqi: 278, tone: "very-poor", icon: "❄️" },
  { season: "Pre-monsoon", months: "Mar–May", aqi: 214, tone: "poor",     icon: "☀️" },
  { season: "Monsoon", months: "Jun–Sep",  aqi: 138, tone: "moderate",  icon: "🌧️" },
  { season: "Post-monsoon", months: "Oct",       aqi: 211, tone: "poor",     icon: "🍂" },
];

const aqiScaleData = [
  { label: "Good",        range: "0–50",   color: "#3a8d7d", bg: "rgba(58,141,125,0.12)" },
  { label: "Satisfactory",range: "51–100", color: "#7ca982", bg: "rgba(124,169,130,0.12)" },
  { label: "Moderate",    range: "101–200",color: "#c69b4d", bg: "rgba(198,155,77,0.12)" },
  { label: "Poor",        range: "201–300",color: "#d18642", bg: "rgba(209,134,66,0.12)" },
  { label: "Very Poor",   range: "301–400",color: "#ca6f4c", bg: "rgba(202,111,76,0.12)" },
  { label: "Severe",      range: "401–500",color: "#9b3d31", bg: "rgba(155,61,49,0.12)" },
];

seasonData.splice(
  0,
  seasonData.length,
  { season: "Winter", months: "Nov-Feb", aqi: 278, tone: "very-poor", icon: "W" },
  { season: "Pre-monsoon", months: "Mar-May", aqi: 214, tone: "poor", icon: "S" },
  { season: "Monsoon", months: "Jun-Sep", aqi: 138, tone: "moderate", icon: "R" },
  { season: "Post-monsoon", months: "Oct", aqi: 211, tone: "poor", icon: "P" },
);

aqiScaleData.splice(
  0,
  aqiScaleData.length,
  { label: "Good", range: "0-50", color: "#3a8d7d", bg: "rgba(58,141,125,0.12)" },
  { label: "Satisfactory", range: "51-100", color: "#7ca982", bg: "rgba(124,169,130,0.12)" },
  { label: "Moderate", range: "101-200", color: "#c69b4d", bg: "rgba(198,155,77,0.12)" },
  { label: "Poor", range: "201-300", color: "#d18642", bg: "rgba(209,134,66,0.12)" },
  { label: "Very Poor", range: "301-400", color: "#ca6f4c", bg: "rgba(202,111,76,0.12)" },
  { label: "Severe", range: "401-500", color: "#9b3d31", bg: "rgba(155,61,49,0.12)" },
);

const monthlyHeatmapData = [
  { month: "Jan", aqi: 320 }, { month: "Feb", aqi: 295 },
  { month: "Mar", aqi: 258 }, { month: "Apr", aqi: 220 },
  { month: "May", aqi: 198 }, { month: "Jun", aqi: 168 },
  { month: "Jul", aqi: 145 }, { month: "Aug", aqi: 138 },
  { month: "Sep", aqi: 172 }, { month: "Oct", aqi: 248 },
  { month: "Nov", aqi: 310 }, { month: "Dec", aqi: 336 },
];

const scatterPoints = [
  {pm25:20,aqi:62},{pm25:35,aqi:98},{pm25:48,aqi:132},{pm25:55,aqi:158},
  {pm25:62,aqi:178},{pm25:70,aqi:198},{pm25:78,aqi:218},{pm25:85,aqi:235},
  {pm25:92,aqi:258},{pm25:100,aqi:278},{pm25:112,aqi:305},{pm25:125,aqi:334},
  {pm25:138,aqi:362},{pm25:148,aqi:388},{pm25:160,aqi:412},{pm25:172,aqi:445},
  {pm25:30,aqi:82},{pm25:42,aqi:118},{pm25:58,aqi:162},{pm25:75,aqi:208},
  {pm25:88,aqi:242},{pm25:105,aqi:288},{pm25:130,aqi:342},{pm25:155,aqi:398},
];

const agreementData = [
  { label: "Linear vs RF",   value: 94 },
  { label: "Linear vs SVM",  value: 88 },
  { label: "RF vs SVM",      value: 91 },
];

const modelPerformance = [
  { label: "Linear Regression", short: "LR", accuracy: 89, error: 14.2, confidence: 87, color: "#36A2EB" },
  { label: "Random Forest", short: "RF", accuracy: 94, error: 8.6, confidence: 96, color: "#4BC0C0" },
  { label: "SVM", short: "SVR", accuracy: 91, error: 11.4, confidence: 90, color: "#FF6384" },
];

const actualAqiSeries = [124, 136, 148, 157, 166, 181, 193];

// ── Navigation ────────────────────────────────────────────────────────────────
function showPage(pageName) {
  Object.entries(pages).forEach(([name, el]) =>
    el.classList.toggle("page-active", name === pageName)
  );
  navLinks.forEach(btn =>
    btn.classList.toggle("is-active", btn.dataset.page === pageName)
  );
  requestAnimationFrame(() => renderVisiblePageCharts(pageName));
  closeMobileNav();
}

function openMobileNav() {
  if (!sidebar || !navToggle) return;
  sidebar.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeMobileNav() {
  if (!sidebar || !navToggle) return;
  sidebar.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleMobileNav() {
  if (!sidebar) return;
  if (sidebar.classList.contains("is-open")) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

function safeRender(renderFn) {
  try {
    renderFn();
  } catch (error) {
    console.error("Render failed:", error);
  }
}

function renderVisiblePageCharts(pageName) {
  if (pageName === "analysis") {
    safeRender(() => renderRadarChart());
    safeRender(() => renderRiskMatrix());
    safeRender(() => renderCorrelationGrid());
  }

  if (pageName === "visualization") {
    safeRender(() => renderBars(pollutionChart, pollutionData, "%"));
    safeRender(() => renderMultiSeriesChart(cityTrendChart, citySeries));
    safeRender(() => renderContributionMix());
    safeRender(() => renderDonutChart());
    safeRender(() => renderMonthlyHeatmap());
    safeRender(() => renderScatterChart());
    safeRender(() => renderBars(document.getElementById("agreement-bars"), agreementData, "%"));
  }

  if (pageName === "home") {
    safeRender(() => renderSingleTrendChart(homeTrendChart, monthlyTrendData));
    safeRender(() => renderSeasonGrid());
    safeRender(() => renderAqiScaleStrip());
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getAqiCategory(value) {
  if (value <= 50)  return { label: "Good",        tone: "good" };
  if (value <= 100) return { label: "Satisfactory", tone: "satisfactory" };
  if (value <= 200) return { label: "Moderate",     tone: "moderate" };
  if (value <= 300) return { label: "Poor",         tone: "poor" };
  if (value <= 400) return { label: "Very Poor",    tone: "very-poor" };
  return                   { label: "Severe",       tone: "severe" };
}

function getDominantPollutant(data) {
  return [
    { label:"PM2.5",   value:Number(data.pm25) },
    { label:"PM10",    value:Number(data.pm10) },
    { label:"NO",      value:Number(data.no) },
    { label:"NO2",     value:Number(data.no2) },
    { label:"NOx",     value:Number(data.nox) },
    { label:"NH3",     value:Number(data.nh3) },
    { label:"CO",      value:Number(data.co) },
    { label:"SO2",     value:Number(data.so2) },
    { label:"O3",      value:Number(data.o3) },
    { label:"Benzene", value:Number(data.benzene) },
  ].sort((a, b) => b.value - a.value)[0];
}

// ── Bar charts ────────────────────────────────────────────────────────────────
function renderBars(container, items, suffix = "") {
  const maxValue = Math.max(...items.map(i => i.value), 1);
  container.innerHTML = items.map(item => `
    <div class="bar-item">
      <div class="bar-meta">
        <span>${item.label}</span>
        <span>${item.value}${suffix}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(item.value/maxValue)*100}%"></div>
      </div>
    </div>`).join("");
}

// ── KPI grid ──────────────────────────────────────────────────────────────────
function renderKpis() {
  const kpis = [
    { label:"Average AQI",      value:"214", detail:"Across reference city monitoring views" },
    { label:"Peak Season",      value:"Nov–Dec", detail:"Highest pollution pressure in winter" },
    { label:"Top Driver",       value:"PM2.5", detail:"Fine particulates dominate the risk profile" },
  ];
  kpis.length = 0;
  kpis.push(
    { label:"Reference AQI", value:"203", detail:"Current dashboard snapshot sits in the Poor band" },
    { label:"Peak Season", value:"Nov-Dec", detail:"Winter pressure remains the clearest AQI stress period" },
    { label:"Lead Pollutant", value:"PM2.5", detail:"Fine particulates are the strongest recurring AQI driver" },
  );
  overviewKpis.innerHTML = kpis.map(item => `
    <article class="stat-card stat-card-rich">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <p>${item.detail}</p>
    </article>`).join("");
}

// ── SVG line paths ────────────────────────────────────────────────────────────
function buildLinePath(values, width, height, padding) {
  const max = Math.max(...values), min = Math.min(...values);
  const range = Math.max(max - min, 1);
  return values.map((v, i) => {
    const x = padding + i * (width - padding*2) / (values.length - 1);
    const y = height - padding - ((v - min) / range) * (height - padding*2);
    return `${i===0?"M":"L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function buildAreaPath(values, width, height, padding) {
  const top = buildLinePath(values, width, height, padding);
  return `${top} L ${width-padding} ${height-padding} L ${padding} ${height-padding} Z`;
}

function renderSingleTrendChart(container, data) {
  const W=760, H=260, P=28;
  const values = data.map(d => d.value);
  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="chart-svg" role="img">
      <defs>
        <linearGradient id="trend-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="rgba(15,118,110,0.35)"/>
          <stop offset="100%" stop-color="rgba(15,118,110,0.02)"/>
        </linearGradient>
      </defs>
      <path d="${buildAreaPath(values,W,H,P)}" fill="url(#trend-fill)"/>
      <path d="${buildLinePath(values,W,H,P)}" class="line-path"/>
      ${data.map((item,i) => {
        const max=Math.max(...values), min=Math.min(...values), range=Math.max(max-min,1);
        const x = P + i*(W-P*2)/(data.length-1);
        const y = H - P - ((item.value-min)/range)*(H-P*2);
        return `<circle cx="${x}" cy="${y}" r="4.5" class="line-point"/>`;
      }).join("")}
    </svg>
    <div class="axis-labels">${data.map(d=>`<span>${d.label}</span>`).join("")}</div>`;
}

function renderMultiSeriesChart(container, series) {
  const W=760, H=280, P=28;
  const all = series.flatMap(s => s.values);
  const max = Math.max(...all), min = Math.min(...all), range = Math.max(max-min,1);
  const lines = series.map(s => {
    const path = s.values.map((v,i) => {
      const x = P + i*(W-P*2)/(s.values.length-1);
      const y = H - P - ((v-min)/range)*(H-P*2);
      return `${i===0?"M":"L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
    return `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="4" stroke-linecap="round"/>`;
  }).join("");
  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="chart-svg">
      ${lines}
    </svg>
    <div class="chart-legend">
      ${series.map(s=>`<span class="legend-chip"><i style="background:${s.color}"></i>${s.name}</span>`).join("")}
    </div>
    <div class="axis-labels">${monthlyTrendData.map(d=>`<span>${d.label}</span>`).join("")}</div>`;
}

// ── Risk heatmap ──────────────────────────────────────────────────────────────
function renderRiskMatrix() {
  const headers = pollutantRiskColumns.map(c=>`<span class="heatmap-header">${c}</span>`).join("");
  const rows = pollutantRiskRows.map(row => {
    const cells = row.values.map(v =>
      `<span class="heatmap-cell" style="--cell-alpha:${Math.max(0.2,v/100)}">${v}</span>`
    ).join("");
    return `<div class="heatmap-row"><span class="heatmap-label">${row.label}</span>${cells}</div>`;
  }).join("");
  riskMatrix.innerHTML =
    `<div class="heatmap-row heatmap-top"><span class="heatmap-label">Pollutant</span>${headers}</div>${rows}`;
}

// ── Contribution mix ──────────────────────────────────────────────────────────
function renderContributionMix() {
  pollutantMix.innerHTML = pollutantContributionData.map(item => `
    <div class="mix-item">
      <div class="mix-meta"><span>${item.label}</span><strong>${item.value}%</strong></div>
      <div class="mix-track">
        <div class="mix-fill" style="width:${item.value}%;background:${item.color}"></div>
      </div>
    </div>`).join("");
}

// ── City ranking ──────────────────────────────────────────────────────────────
function renderCityRanking() {
  cityRanking.innerHTML = hotspotCities.map(item => `
    <div class="city-item city-rank">
      <span>${item.city}</span>
      <strong>${item.average}</strong>
      <p>${item.trend}</p>
    </div>`).join("");
}

// ── Gauge ─────────────────────────────────────────────────────────────────────
function updateGauge(value) {
  const bounded = Math.min(Math.max(value, 0), 500);
  const pct = (bounded / 500) * 100;
  const cat = getAqiCategory(value);
  gauge.style.setProperty("--gauge-fill", `${pct}%`);
  gauge.dataset.tone = cat.tone;
  gaugeValue.textContent = value.toFixed(1);
  gaugeLabel.textContent = cat.label;
}

// ── Prediction summary ────────────────────────────────────────────────────────
function renderPredictionSummary(consensus, spread, dominantPollutant) {
  const cat = getAqiCategory(consensus);
  predictionSummary.innerHTML = `
    <div class="insight-card">
      <span class="metric-label">Category</span>
      <strong>${cat.label}</strong>
      <p>Consensus AQI places this reading in the ${cat.label.toLowerCase()} zone.</p>
    </div>
    <div class="insight-card">
      <span class="metric-label">Model Spread</span>
      <strong>${spread.toFixed(1)}</strong>
      <p>Smaller spread means the three models are in tighter agreement.</p>
    </div>
    <div class="insight-card">
      <span class="metric-label">Dominant Driver</span>
      <strong>${dominantPollutant.label}</strong>
      <p>${dominantPollutant.label} is the strongest input in the current sample profile.</p>
    </div>`;
}

function updatePredictionVisual(consensus, dominantPollutant) {
  const cat = getAqiCategory(consensus);
  predictionVisualTitle.textContent = `${cat.label} air quality outlook`;
  predictionVisualAqi.textContent = consensus.toFixed(1);
  predictionVisualCategory.textContent = cat.label;
  predictionVisualDriver.textContent = dominantPollutant.label;
}

function getBestModel(entries) {
  return modelPerformance.reduce((best, model) =>
    model.accuracy > best.accuracy ? model : best
  );
}

function renderPredictionCards(entries) {
  predictionCards.innerHTML = entries.map((entry) => {
    const modelMeta = modelPerformance.find((model) => model.label === entry.label);
    const delta = entry.value - entries.reduce((sum, item) => sum + item.value, 0) / entries.length;
    return `
      <article class="prediction-model-card">
        <span class="metric-label">${modelMeta.short} Prediction</span>
        <strong>${entry.label}</strong>
        <strong class="prediction-model-value">${entry.value.toFixed(1)}</strong>
        <div class="prediction-card-meta">
          <span>Accuracy ${modelMeta.accuracy}%</span>
          <span>${delta >= 0 ? "+" : ""}${delta.toFixed(1)} vs avg</span>
        </div>
      </article>`;
  }).join("");
}

function renderBestModelCard(bestModel) {
  bestModelCard.innerHTML = `
    <span class="best-model-kicker">Best Performing Model</span>
    <strong class="best-model-title">${bestModel.label}</strong>
    <div class="best-model-stats">
      <div class="best-model-stat">
        <span class="metric-label">Accuracy</span>
        <strong>${bestModel.accuracy}%</strong>
      </div>
      <div class="best-model-stat">
        <span class="metric-label">Lowest Error</span>
        <strong>${bestModel.error}</strong>
      </div>
      <div class="best-model-stat">
        <span class="metric-label">Confidence</span>
        <strong>${bestModel.confidence}%</strong>
      </div>
    </div>`;
}

function renderActualVsPredicted(entries) {
  const W = 720, H = 300, PL = 48, PR = 18, PT = 24, PB = 34;
  const xLabels = ["D1", "D2", "D3", "D4", "D5", "D6", "Today"];
  const rf = [128, 139, 145, 154, 164, 177, entries.find((e) => e.label === "Random Forest").value];
  const lr = [132, 141, 150, 160, 169, 184, entries.find((e) => e.label === "Linear Regression").value];
  const svr = [130, 138, 147, 158, 167, 180, entries.find((e) => e.label === "SVM").value];
  const series = [
    { label: "Actual AQI", values: actualAqiSeries, color: "#114b46" },
    { label: "RF Prediction", values: rf, color: "#4BC0C0" },
    { label: "LR Prediction", values: lr, color: "#36A2EB" },
    { label: "SVR Prediction", values: svr, color: "#FF6384" },
  ];
  const yMax = 260;
  const scX = (index) => PL + index * (W - PL - PR) / (xLabels.length - 1);
  const scY = (value) => PT + (1 - value / yMax) * (H - PT - PB);

  let grid = "";
  for (let y = 0; y <= yMax; y += 50) {
    const py = scY(y).toFixed(1);
    grid += `<line x1="${PL}" y1="${py}" x2="${W - PR}" y2="${py}" stroke="rgba(28,49,42,0.08)" stroke-width="1"/>`;
    grid += `<text x="${PL - 8}" y="${py}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#61716b" font-family="Manrope,sans-serif">${y}</text>`;
  }

  xLabels.forEach((label, index) => {
    const px = scX(index).toFixed(1);
    grid += `<text x="${px}" y="${H - 10}" text-anchor="middle" font-size="10" fill="#61716b" font-family="Manrope,sans-serif">${label}</text>`;
  });

  let hoverBands = "";
  xLabels.forEach((_, index) => {
    const x = scX(index);
    const nextX = index < xLabels.length - 1 ? scX(index + 1) : W - PR;
    const prevX = index > 0 ? scX(index - 1) : PL;
    const startX = index === 0 ? PL : (prevX + x) / 2;
    const endX = index === xLabels.length - 1 ? W - PR : (x + nextX) / 2;
    hoverBands += `<rect class="ap-hit-zone" data-index="${index}" x="${startX.toFixed(1)}" y="${PT}" width="${(endX - startX).toFixed(1)}" height="${(H - PT - PB).toFixed(1)}" fill="transparent"/>`;
  });

  const lines = series.map((item) => {
    const path = item.values.map((value, index) => {
      const x = scX(index).toFixed(1);
      const y = scY(value).toFixed(1);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    const dots = item.values.map((value, index) => `
      <circle cx="${scX(index).toFixed(1)}" cy="${scY(value).toFixed(1)}" r="4.5" fill="${item.color}" stroke="white" stroke-width="1.5"/>
    `).join("");
    return `<path d="${path}" fill="none" stroke="${item.color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
  }).join("");

  actualPredictedChart.innerHTML = `
    ${grid}
    ${lines}
    <line id="ap-hover-line" x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="rgba(28,49,42,0.18)" stroke-width="1.5" stroke-dasharray="5,5" opacity="0"/>
    <g id="ap-hover-points"></g>
    ${hoverBands}`;
  actualPredictedLegend.innerHTML = series.map((item) => `
    <span class="legend-chip">
      <i style="background:${item.color}"></i>
      ${item.label}
    </span>`).join("");

  const hoverLine = document.getElementById("ap-hover-line");
  const hoverPoints = document.getElementById("ap-hover-points");
  const hitZones = actualPredictedChart.querySelectorAll(".ap-hit-zone");
  const chartWrap = actualPredictedChart.parentElement;
  const updateHover = (index, clientX) => {
    const x = scX(index).toFixed(1);
    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);
    hoverLine.setAttribute("opacity", "1");
    hoverPoints.innerHTML = series.map((item) => `
      <circle cx="${x}" cy="${scY(item.values[index]).toFixed(1)}" r="7" fill="${item.color}" fill-opacity="0.16"/>
      <circle cx="${x}" cy="${scY(item.values[index]).toFixed(1)}" r="4.5" fill="${item.color}" stroke="white" stroke-width="1.5"/>
    `).join("");

    actualPredictedTooltip.classList.remove("is-hidden");
    actualPredictedTooltip.innerHTML = `
      <div class="chart-tooltip-title">${xLabels[index]}</div>
      ${series.map((item) => `
        <div class="chart-tooltip-row">
          <span class="chart-tooltip-label">
            <i class="chart-tooltip-swatch" style="background:${item.color}"></i>
            ${item.label}
          </span>
          <strong>${Number(item.values[index]).toFixed(1)}</strong>
        </div>
      `).join("")}`;

    const rect = chartWrap.getBoundingClientRect();
    const tooltipWidth = actualPredictedTooltip.offsetWidth || 180;
    const leftPadding = tooltipWidth / 2 + 12;
    const rightPadding = tooltipWidth / 2 + 12;
    const left = Math.min(
      Math.max(clientX - rect.left, leftPadding),
      rect.width - rightPadding
    );
    actualPredictedTooltip.style.left = `${left}px`;
    actualPredictedTooltip.style.top = `12px`;
  };

  const clearHover = () => {
    hoverLine.setAttribute("opacity", "0");
    hoverPoints.innerHTML = "";
    actualPredictedTooltip.classList.add("is-hidden");
  };

  hitZones.forEach((zone) => {
    zone.addEventListener("mousemove", (event) => {
      updateHover(Number(zone.dataset.index), event.clientX);
    });
    zone.addEventListener("mouseenter", (event) => {
      updateHover(Number(zone.dataset.index), event.clientX);
    });
    zone.addEventListener("mouseleave", clearHover);
  });
}

// ── Prediction result ─────────────────────────────────────────────────────────
function renderPredictionResult(result) {
  const entries = [
    { label:"Linear Regression", value: Number(result["Linear Regression"]) },
    { label:"Random Forest",     value: Number(result["Random Forest"]) },
    { label:"SVM",               value: Number(result["SVM"]) },
  ];
  const values    = entries.map(e => e.value);
  const consensus = values.reduce((s,v) => s+v, 0) / values.length;
  const spread    = Math.max(...values) - Math.min(...values);
  const cat       = getAqiCategory(consensus);

  resultBox.innerHTML = `
    <div class="result-summary">
      <div class="result-heading">
        <span class="result-kicker">Model Output</span>
        <strong>${consensus.toFixed(1)}</strong>
      </div>
      <span class="aqi-badge ${cat.tone}">${cat.label}</span>
    </div>
    <div class="stack-list">
      ${entries.map(e=>`
        <div class="city-item">
          <span>${e.label}</span>
          <strong>${e.value.toFixed(2)}</strong>
        </div>`).join("")}
    </div>`;

  renderBars(modelChart, entries);
  renderPredictionCards(entries);
  renderBestModelCard(getBestModel(entries));
  renderActualVsPredicted(entries);
  updateGauge(consensus);
  updateSidebarAQI(consensus);
  return { consensus, spread };
}

// ── Input profile heatmap ─────────────────────────────────────────────────────
function renderInputProfile(data) {
  const fields = [
    { label:"PM2.5",   value:Number(data.pm25),   max:200 },
    { label:"PM10",    value:Number(data.pm10),   max:300 },
    { label:"NO",      value:Number(data.no),     max:100 },
    { label:"NO2",     value:Number(data.no2),    max:150 },
    { label:"NOx",     value:Number(data.nox),    max:200 },
    { label:"NH3",     value:Number(data.nh3),    max:100 },
    { label:"CO",      value:Number(data.co),     max:10  },
    { label:"SO2",     value:Number(data.so2),    max:150 },
    { label:"O3",      value:Number(data.o3),     max:200 },
    { label:"Benzene", value:Number(data.benzene),max:50  },
  ];
  const container = document.getElementById("input-profile");
  container.innerHTML = fields.map(f => {
    const pct = Math.min((f.value / f.max) * 100, 100);
    const hue = Math.round(140 - pct * 1.2); // green→red
    return `
      <div class="profile-cell" style="--cell-pct:${pct}%;--cell-hue:${hue}">
        <span class="profile-label">${f.label}</span>
        <span class="profile-val">${f.value}</span>
        <div class="profile-bar"></div>
      </div>`;
  }).join("");
}

// ── Radar chart ───────────────────────────────────────────────────────────────
function renderRadarChart() {
  const svg = document.getElementById("radar-chart");
  const cx=210, cy=185, r=140, n=radarData.length;
  const angleStep = (Math.PI*2)/n;

  // Grid rings
  let rings = "";
  for (let i=1; i<=5; i++) {
    const ri = r * i/5;
    const pts = radarData.map((_,j) => {
      const angle = j*angleStep - Math.PI/2;
      return `${(cx+ri*Math.cos(angle)).toFixed(1)},${(cy+ri*Math.sin(angle)).toFixed(1)}`;
    }).join(" ");
    rings += `<polygon points="${pts}" fill="none" stroke="rgba(28,49,42,0.1)" stroke-width="1"/>`;
  }

  // Axes
  const axes = radarData.map((_,j) => {
    const angle = j*angleStep - Math.PI/2;
    const ex = (cx + r*Math.cos(angle)).toFixed(1);
    const ey = (cy + r*Math.sin(angle)).toFixed(1);
    return `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="rgba(28,49,42,0.12)" stroke-width="1"/>`;
  }).join("");

  // Data polygon
  const polyPts = radarData.map((d,j) => {
    const angle = j*angleStep - Math.PI/2;
    const ri = r * d.value;
    return `${(cx+ri*Math.cos(angle)).toFixed(1)},${(cy+ri*Math.sin(angle)).toFixed(1)}`;
  }).join(" ");

  // Labels
  const labels = radarData.map((d,j) => {
    const angle = j*angleStep - Math.PI/2;
    const lx = (cx + (r+22)*Math.cos(angle)).toFixed(1);
    const ly = (cy + (r+22)*Math.sin(angle)).toFixed(1);
    const anchor = Math.cos(angle) > 0.1 ? "start" : Math.cos(angle) < -0.1 ? "end" : "middle";
    return `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="13" font-weight="700" fill="#61716b" font-family="Manrope,sans-serif">${d.label}</text>`;
  }).join("");

  // Dots
  const dots = radarData.map((d,j) => {
    const angle = j*angleStep - Math.PI/2;
    const ri = r * d.value;
    const dx = (cx+ri*Math.cos(angle)).toFixed(1);
    const dy = (cy+ri*Math.sin(angle)).toFixed(1);
    return `<circle cx="${dx}" cy="${dy}" r="5" fill="${d.color}" stroke="white" stroke-width="2"/>`;
  }).join("");

  svg.innerHTML = `
    ${rings}${axes}
    <polygon points="${polyPts}" fill="rgba(15,118,110,0.18)" stroke="#0f766e" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}${labels}`;

  // Legend
  const legend = document.getElementById("radar-legend");
  legend.innerHTML = radarData.map(d => `
    <span class="legend-chip">
      <i style="background:${d.color}"></i>
      ${d.label} <strong>${Math.round(d.value*100)}%</strong>
    </span>`).join("");
}

// ── Correlation grid ──────────────────────────────────────────────────────────
function renderCorrelationGrid() {
  const container = document.getElementById("correlation-grid");
  container.innerHTML = correlationData.map(d => `
    <div class="corr-card">
      <span class="corr-label">${d.label}</span>
      <div class="corr-bar-track">
        <div class="corr-bar-fill" style="width:${d.corr*100}%;background:${d.color}"></div>
      </div>
      <strong class="corr-val">${d.corr.toFixed(2)}</strong>
    </div>`).join("");
}

// ── Season cards ──────────────────────────────────────────────────────────────
function getSeasonIconMarkup(season) {
  const icons = {
    "Winter": `
      <svg viewBox="0 0 48 48" class="season-icon-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="rgba(58,141,125,0.14)"/>
        <path d="M24 10V38M12 17L36 31M12 31L36 17M16 12L32 36M32 12L16 36" stroke="#114b46" stroke-width="2.8" stroke-linecap="round"/>
      </svg>`,
    "Pre-monsoon": `
      <svg viewBox="0 0 48 48" class="season-icon-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="rgba(209,134,66,0.16)"/>
        <circle cx="24" cy="24" r="8" fill="#d18642"/>
        <path d="M24 8V13M24 35V40M8 24H13M35 24H40M13.5 13.5L17.2 17.2M30.8 30.8L34.5 34.5M34.5 13.5L30.8 17.2M17.2 30.8L13.5 34.5" stroke="#d18642" stroke-width="2.6" stroke-linecap="round"/>
      </svg>`,
    "Monsoon": `
      <svg viewBox="0 0 48 48" class="season-icon-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="rgba(15,118,110,0.14)"/>
        <path d="M16 24C16 20.7 18.7 18 22 18C23.5 15.5 26 14 29 14C33.4 14 37 17.6 37 22C39.4 22.4 41.2 24.5 41.2 27C41.2 29.8 38.9 32 36.2 32H18C14.7 32 12 29.3 12 26C12 23.4 13.7 21.2 16 20.4" fill="none" stroke="#0f766e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 34L17 38M25 34L23 40M31 34L29 38" stroke="#0f766e" stroke-width="2.6" stroke-linecap="round"/>
      </svg>`,
    "Post-monsoon": `
      <svg viewBox="0 0 48 48" class="season-icon-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="rgba(202,111,76,0.14)"/>
        <path d="M24 12C24 18 18 20 18 26C18 30.5 20.9 34 24 36C27.1 34 30 30.5 30 26C30 20 24 18 24 12Z" fill="#ca6f4c"/>
        <path d="M24 16C24 20.5 20.5 22.4 20.5 26.4C20.5 29.2 22.1 31.5 24 33C25.9 31.5 27.5 29.2 27.5 26.4C27.5 22.4 24 20.5 24 16Z" fill="#f1d3ad"/>
      </svg>`,
  };
  return icons[season] || `
    <svg viewBox="0 0 48 48" class="season-icon-svg" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="rgba(15,118,110,0.12)"/>
      <circle cx="24" cy="24" r="8" fill="#0f766e"/>
    </svg>`;
}

function renderSeasonGrid() {
  const container = document.getElementById("season-grid");
  container.innerHTML = seasonData.map(s => `
    <div class="season-card tone-${s.tone}">
      <span class="season-icon">${getSeasonIconMarkup(s.season)}</span>
      <span class="metric-label">${s.season}</span>
      <strong class="season-aqi">${s.aqi}</strong>
      <span class="season-months">${s.months}</span>
      <span class="aqi-badge ${s.tone}">${getAqiCategory(s.aqi).label}</span>
    </div>`).join("");
}

// ── AQI scale strip ───────────────────────────────────────────────────────────
function renderAqiScaleStrip() {
  const container = document.getElementById("aqi-scale-strip");
  container.innerHTML = aqiScaleData.map(d => `
    <div class="scale-cell" style="border-color:${d.color};background:${d.bg}">
      <div class="scale-swatch" style="background:${d.color}"></div>
      <strong style="color:${d.color}">${d.label}</strong>
      <span>${d.range}</span>
    </div>`).join("");
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function renderDonutChart() {
  const svg    = document.getElementById("donut-chart");
  const cx=160, cy=160, ro=120, ri=72;
  const total  = pollutantContributionData.reduce((s,d)=>s+d.value,0);
  let angle    = -Math.PI/2;
  let slices   = "";

  pollutantContributionData.forEach(d => {
    const slice = (d.value/total) * Math.PI*2;
    const x1 = (cx + ro*Math.cos(angle)).toFixed(2);
    const y1 = (cy + ro*Math.sin(angle)).toFixed(2);
    const x2 = (cx + ro*Math.cos(angle+slice)).toFixed(2);
    const y2 = (cy + ro*Math.sin(angle+slice)).toFixed(2);
    const ix1= (cx + ri*Math.cos(angle)).toFixed(2);
    const iy1= (cy + ri*Math.sin(angle)).toFixed(2);
    const ix2= (cx + ri*Math.cos(angle+slice)).toFixed(2);
    const iy2= (cy + ri*Math.sin(angle+slice)).toFixed(2);
    const large = slice > Math.PI ? 1 : 0;
    slices += `<path d="M ${ix1} ${iy1} L ${x1} ${y1} A ${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z"
      fill="${d.color}" opacity="0.88" stroke="white" stroke-width="2"/>`;
    angle += slice;
  });

  svg.innerHTML = `
    ${slices}
    <text x="${cx}" y="${cy-8}" text-anchor="middle" font-size="28" font-weight="700" fill="#1c312a" font-family="Space Grotesk,sans-serif">100%</text>
    <text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="12" fill="#61716b" font-family="Manrope,sans-serif">Total Mix</text>`;

  const legend = document.getElementById("donut-legend");
  legend.innerHTML = pollutantContributionData.map(d => `
    <span class="legend-chip">
      <i style="background:${d.color}"></i>
      ${d.label} <strong>${d.value}%</strong>
    </span>`).join("");
}

// ── Monthly heatmap ───────────────────────────────────────────────────────────
function renderMonthlyHeatmap() {
  const container = document.getElementById("monthly-heatmap");
  const max = Math.max(...monthlyHeatmapData.map(d=>d.aqi));
  container.innerHTML = monthlyHeatmapData.map(d => {
    const intensity = d.aqi/max;
    const cat = getAqiCategory(d.aqi);
    const colors = {
      good:"#3a8d7d", satisfactory:"#7ca982", moderate:"#c69b4d",
      poor:"#d18642", "very-poor":"#ca6f4c", severe:"#9b3d31"
    };
    const bg = colors[cat.tone];
    return `
      <div class="heatmap-month" style="background:${bg};opacity:${0.35+intensity*0.65}">
        <span class="hm-month">${d.month}</span>
        <strong class="hm-aqi">${d.aqi}</strong>
        <span class="hm-cat">${cat.label}</span>
      </div>`;
  }).join("");
}

// ── Scatter plot ──────────────────────────────────────────────────────────────
function renderScatterChart() {
  const svg = document.getElementById("scatter-chart");
  const W=720, H=300, PL=48, PR=20, PT=20, PB=36;
  const xs = scatterPoints.map(p=>p.pm25);
  const ys = scatterPoints.map(p=>p.aqi);
  const xMin=0, xMax=200, yMin=0, yMax=500;
  const scX = v => PL + (v-xMin)/(xMax-xMin) * (W-PL-PR);
  const scY = v => PT + (1-(v-yMin)/(yMax-yMin)) * (H-PT-PB);

  // Grid lines
  let grid = "";
  for (let y=0; y<=500; y+=100) {
    const py = scY(y).toFixed(1);
    grid += `<line x1="${PL}" y1="${py}" x2="${W-PR}" y2="${py}" stroke="rgba(28,49,42,0.07)" stroke-width="1"/>
    <text x="${PL-6}" y="${py}" text-anchor="end" font-size="10" fill="#61716b" font-family="Manrope,sans-serif" dominant-baseline="middle">${y}</text>`;
  }
  for (let x=0; x<=200; x+=50) {
    const px = scX(x).toFixed(1);
    grid += `<line x1="${px}" y1="${PT}" x2="${px}" y2="${H-PB}" stroke="rgba(28,49,42,0.07)" stroke-width="1"/>
    <text x="${px}" y="${H-PB+14}" text-anchor="middle" font-size="10" fill="#61716b" font-family="Manrope,sans-serif">${x}</text>`;
  }

  // Trend line (simple linear)
  const n=scatterPoints.length;
  const sumX=xs.reduce((a,b)=>a+b,0), sumY=ys.reduce((a,b)=>a+b,0);
  const sumXY=scatterPoints.reduce((s,p)=>s+p.pm25*p.aqi,0), sumX2=xs.reduce((s,x)=>s+x*x,0);
  const m = (n*sumXY - sumX*sumY)/(n*sumX2 - sumX*sumX);
  const b = (sumY - m*sumX)/n;
  const tx1=scX(0).toFixed(1), ty1=scY(b).toFixed(1);
  const tx2=scX(180).toFixed(1), ty2=scY(m*180+b).toFixed(1);

  const dots = scatterPoints.map(p => {
    const cat = getAqiCategory(p.aqi);
    const colors = { good:"#3a8d7d", satisfactory:"#7ca982", moderate:"#c69b4d", poor:"#d18642", "very-poor":"#ca6f4c", severe:"#9b3d31" };
    return `<circle cx="${scX(p.pm25).toFixed(1)}" cy="${scY(p.aqi).toFixed(1)}" r="6"
      fill="${colors[cat.tone]}" opacity="0.8" stroke="white" stroke-width="1.5"/>`;
  }).join("");

  // Axis labels
  const axisLabels = `
    <text x="${(PL+(W-PR))/2}" y="${H}" text-anchor="middle" font-size="11" fill="#61716b" font-family="Manrope,sans-serif">PM2.5 (µg/m³)</text>
    <text x="12" y="${(PT+(H-PB))/2}" text-anchor="middle" font-size="11" fill="#61716b" font-family="Manrope,sans-serif" transform="rotate(-90,12,${(PT+(H-PB))/2})">AQI</text>`;

  svg.innerHTML = `${grid}
    <line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="rgba(15,118,110,0.5)" stroke-width="2" stroke-dasharray="6,4"/>
    ${dots}${axisLabels}`;
}

// ── Sidebar live AQI ──────────────────────────────────────────────────────────
function renderSidebarSparkline() {
  const vals = [210,218,203,225,196,214,208,222,200,203];
  const W=220, H=40, P=4;
  const max=Math.max(...vals), min=Math.min(...vals), range=Math.max(max-min,1);
  const path = vals.map((v,i) => {
    const x = P + i*(W-P*2)/(vals.length-1);
    const y = H - P - ((v-min)/range)*(H-P*2);
    return `${i===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const spark = document.getElementById("sidebar-sparkline");
  spark.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:40px">
    <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

function updateSidebarAQI(value) {
  const el  = document.getElementById("sidebar-aqi-val");
  const badge = document.getElementById("sidebar-aqi-badge");
  const cat = getAqiCategory(value);
  if (el) el.textContent = value.toFixed(0);
  if (badge) { badge.textContent = cat.label; badge.className = `aqi-badge ${cat.tone}`; }
}

// ── Form helpers ──────────────────────────────────────────────────────────────
function fillSampleData() {
  document.getElementById("pm25").value    = 65;
  document.getElementById("pm10").value    = 140;
  document.getElementById("no").value      = 20;
  document.getElementById("no2").value     = 40;
  document.getElementById("nox").value     = 55;
  document.getElementById("nh3").value     = 18;
  document.getElementById("co").value      = 0.8;
  document.getElementById("so2").value     = 10;
  document.getElementById("o3").value      = 35;
  document.getElementById("benzene").value = 2.1;
  renderInputProfile(collectFormData());
}

function collectFormData() {
  return {
    pm25:    document.getElementById("pm25").value,
    pm10:    document.getElementById("pm10").value,
    no:      document.getElementById("no").value,
    no2:     document.getElementById("no2").value,
    nox:     document.getElementById("nox").value,
    nh3:     document.getElementById("nh3").value,
    co:      document.getElementById("co").value,
    so2:     document.getElementById("so2").value,
    o3:      document.getElementById("o3").value,
    benzene: document.getElementById("benzene").value,
  };
}

async function predictAQI(event) {
  event.preventDefault();
  const data = collectFormData();
  resultBox.innerHTML = `<div class="loading-state"><span class="loading-dot"></span> Loading prediction…</div>`;
  renderInputProfile(data);
  resultBox.innerHTML = `<div class="loading-state"><span class="loading-dot"></span> Loading prediction...</div>`;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) { resultBox.innerHTML = `Error: ${result.error || "Prediction failed."}`; return; }
    const { consensus, spread } = renderPredictionResult(result);
    const dominantPollutant = getDominantPollutant(data);
    renderPredictionSummary(consensus, spread, dominantPollutant);
    updatePredictionVisual(consensus, dominantPollutant);
  } catch {
    resultBox.innerHTML = `<div class="error-state">⚠ Backend not connected. Using sample output.</div>`;
    resultBox.innerHTML = `<div class="error-state">Backend not connected. Using sample output.</div>`;
    // Show mock result for UI demo purposes
    const mock = { "Linear Regression": 210, "Random Forest": 196, "SVM": 203 };
    const { consensus, spread } = renderPredictionResult(mock);
    const dominantPollutant = getDominantPollutant(data);
    renderPredictionSummary(consensus, spread, dominantPollutant);
    updatePredictionVisual(consensus, dominantPollutant);
  }
}

// ── Wire up events ────────────────────────────────────────────────────────────
navToggle?.addEventListener("click", toggleMobileNav);
navLinks.forEach(btn  => btn.addEventListener("click",  () => showPage(btn.dataset.page)));
jumpButtons.forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));
predictionForm.addEventListener("submit", predictAQI);
sampleButton.addEventListener("click", fillSampleData);

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) {
    closeMobileNav();
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────
fillSampleData();
renderKpis();
renderBars(severityBars, severityData, "%");
renderBars(pollutionChart, pollutionData, "%");
renderBars(accuracyChart, modelPerformance.map(model => ({
  label: `${model.short} Accuracy`,
  value: model.accuracy,
  color: model.color,
})), "%");
renderBars(document.getElementById("agreement-bars"), agreementData, "%");
renderSingleTrendChart(homeTrendChart, monthlyTrendData);
renderMultiSeriesChart(cityTrendChart, citySeries);
renderRiskMatrix();
renderContributionMix();
renderCityRanking();
renderPredictionResult({
  "Linear Regression": 210,
  "Random Forest": 196,
  "SVM": 203,
});
renderPredictionSummary(203, 14, { label:"PM10" });
updatePredictionVisual(203, { label:"PM10" });
renderInputProfile(collectFormData());

// NEW renders
safeRender(() => renderRadarChart());
safeRender(() => renderCorrelationGrid());
safeRender(() => renderSeasonGrid());
safeRender(() => renderAqiScaleStrip());
safeRender(() => renderDonutChart());
safeRender(() => renderMonthlyHeatmap());
safeRender(() => renderScatterChart());
safeRender(() => renderSidebarSparkline());
renderVisiblePageCharts("home");

const peak = monthlyTrendData.reduce((p,c) => c.value>p.value ? c : p);
homeTrendPeak.textContent = `${peak.value} in ${peak.label}`;

// --- PART 1: D3 MAP CODE ---

const width = 960;
const height = 600;
const projection = d3.geoNaturalEarth1()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);
const svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);
const tooltip = d3.select("#tooltip");

// --- PART 2: GLOBAL "STATE" VARIABLES ---
// We need to remember what the user has selected

let currentCountryCode = "IND"; // Default to India
let currentCountryName = "India";
let currentIndicator = "gdp";   // Default to GDP
let currentIndicatorName = "GDP (Current US$)";

// This object helps us set the chart's Y-axis label
const Y_AXIS_LABELS = {
  gdp: "GDP (Current US$)",
  inflation: "Inflation (Annual %)",
  unemployment: "Unemployment (%)"
};

// --- PART 3: THE CHART UPDATE FUNCTION ---

async function updateChart(countryCode, countryName, indicator, indicatorName) {
  
  console.log(`Attempting to update chart for: ${countryName} (${countryCode}), Indicator: ${indicator}`);
  const chartDiv = document.getElementById('plotly-chart');
  chartDiv.innerHTML = `<h2>Loading ${indicatorName} data for ${countryName}...</h2>`;

  // Build the new dynamic API URL
  const apiUrl = `http://127.0.0.1:5000/api/data/${indicator}/${countryCode}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data.length === 0) {
      chartDiv.innerHTML = `<h2>Sorry, no ${indicatorName} data is available for ${countryName}.</h2>`;
      return;
    }

    // Prepare data for Plotly
    const years = data.map(item => item.date).reverse();
    const values = data.map(item => item.value).reverse();

    const plotData = [{
      x: years,
      y: values,
      type: 'scatter',
      mode: 'lines+markers',
      name: `${countryName} ${indicatorName}`
    }];

    // The layout is now dynamic
    const layout = {
      title: `${countryName} - ${indicatorName}`,
      xaxis: { title: 'Year' },
      yaxis: { title: Y_AXIS_LABELS[indicator] } // Use our label map
    };

    Plotly.newPlot('plotly-chart', plotData, layout);

  } catch (error) {
    console.error('Error in updateChart:', error);
    chartDiv.innerHTML = "<h2>Could not load chart. (Check console)</h2>";
  }
}

// --- PART 4: EVENT LISTENERS ---

// 1. D3 Map Click Listener
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .on("mouseover", function(event, d) { /* ... (tooltip code) ... */ })
    .on("mouseout", function() { /* ... (tooltip code) ... */ })
    .on("click", function(event, d) {
      // When a country is clicked:
      // 1. Update the "current" country
      currentCountryCode = d.id;
      currentCountryName = d.properties.name;
      
      // 2. Redraw the chart using the NEW country but the CURRENT indicator
      updateChart(currentCountryCode, currentCountryName, currentIndicator, currentIndicatorName);
    });
});

// 2. Dropdown Change Listener
const indicatorSelect = document.getElementById('indicator-select');

indicatorSelect.addEventListener('change', (event) => {
  // When the dropdown is changed:
  // 1. Update the "current" indicator
  currentIndicator = event.target.value;
  currentIndicatorName = event.target.options[event.target.selectedIndex].text;
  
  // 2. Redraw the chart using the CURRENT country but the NEW indicator
  updateChart(currentCountryCode, currentCountryName, currentIndicator, currentIndicatorName);
});

// --- PART 5: INITIAL PAGE LOAD ---
// When the page first loads, draw the default chart (India, GDP)
updateChart(currentCountryCode, currentCountryName, currentIndicator, currentIndicatorName);
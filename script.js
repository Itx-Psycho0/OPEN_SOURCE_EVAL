

// Set up dimensions and projection
const width = 960;
const height = 600;
const projection = d3.geoNaturalEarth1()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Create SVG
const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Tooltip
const tooltip = d3.select("#tooltip");

// Load and display the map
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1)
        .html(d.properties.name)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      alert("You selected: " + d.properties.name);
    });
});

// --- PART 2: YOUR NEW PLOTLY CHART CODE ---

console.log("Plotly script started...");

// This is the URL for your Flask "kitchen"
const api_Url = "http://127.0.0.1:5000/api/gdp";

// Use fetch() to get the data from your server
fetch(api_Url)
  .then(response => {
    // Check if the connection was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Convert the response to JSON
  })
  .then(data => {
    // 'data' is now your JSON from Pandas:
    // [ {date: 2022, gdp: 123}, {date: 2021, gdp: 456} ]
    console.log("Data received from Flask:", data);

    // Prepare the data for Plotly (it needs separate X and Y arrays)
    const years = data.map(item => item.date).reverse();
    const gdpValues = data.map(item => item.gdp).reverse();

    // Define the chart data
    const plotData = [{
      x: years,
      y: gdpValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'India GDP'
    }];

    // Define the chart layout
    const layout = {
      title: 'GDP (in USD) Over Time',
      xaxis: { title: 'Year' },
      yaxis: { title: 'GDP ($)' }
    };

    // Draw the chart in the <div id="plotly-chart">
    Plotly.newPlot('plotly-chart', plotData, layout);

  })
  .catch(error => {
    // If the fetch fails (e.g., your server isn't running)
    console.error('Error fetching data:', error);
    document.getElementById('plotly-chart').innerHTML =
      "<h2>Could not load chart. Is the Python server running?</h2>";
  });
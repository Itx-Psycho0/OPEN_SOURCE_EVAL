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

window.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Map Initialization Code ---
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // 1. Initialize the map
        //    SetView([latitude, longitude], zoom_level)
        //    [20, 0] with zoom 2 gives a good global overview.
        const map = L.map('map').setView([20, 0], 2);

        // 2. Add the map's background tiles
        //    We're using a clean, light-themed map from CartoDB.
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            minZoom: 2,
            maxZoom: 10
        }).addTo(map);

        // 3. Define data for markers (using data from your charts)
        const countryData = [
            { name: 'United States', coords: [38.96, -95.71], gdp: 25.4 },
            { name: 'China', coords: [35.86, 104.19], gdp: 17.7 },
            { name: 'Germany', coords: [51.16, 10.45], gdp: 4.2 },
            { name: 'India', coords: [20.59, 78.96], gdp: 3.3 }
        ];

        // 4. Add markers to the map
        countryData.forEach(country => {
            L.marker(country.coords)
             .addTo(map)
             .bindPopup(`<strong>${country.name}</strong><br>GDP: $${country.gdp} Trillion`);
        });
    }
    // --- End of NEW Map Code ---


    const color1 = '#006494';
    const color2 = '#0582CA';
    const color3 = '#00A6FB';
    const color4 = '#003554';
    const textColor = '#051923';
    const gridColor = '#e5e7eb';
    
    function wrapLabel(label) {
        if (typeof label === 'string' && label.length > 16) {
            const words = label.split(' ');
            const lines = [];
            let currentLine = '';
            for (const word of words) {
                if ((currentLine + word).length > 17) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            }
            lines.push(currentLine.trim());
            return lines;
        }
        return label;
    }

    const multiLineTooltipCallback = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const item = tooltipItems[0];
                        if (!item) return '';
                        let label = item.chart.data.labels[item.dataIndex];
                        if (Array.isArray(label)) {
                          return label.join(' ');
                        } else {
                          return String(label);
                        }
                    }
                }
            }
        }
    };
    
    const gdpLabels = ['United States', 'China', 'Germany', 'India'];
    const processedGdpLabels = gdpLabels.map(wrapLabel);
    
    const ctxGdp = document.getElementById('gdpBarChart');
    if(ctxGdp) {
        new Chart(ctxGdp, {
            type: 'bar',
            data: {
                labels: processedGdpLabels,
                datasets: [{
                    label: 'GDP in Trillions (USD)',
                    data: [25.4, 17.7, 4.2, 3.3],
                    backgroundColor: [color1, color2, color3, color4],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                ...multiLineTooltipCallback,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'GDP in Trillions (USD)',
                            color: textColor,
                            font: { size: 14 }
                        },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 12 } }
                    }
                }
            }
        });
    }

    const ctxInflation = document.getElementById('inflationLineChart');
    if(ctxInflation) {
        new Chart(ctxInflation, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                datasets: [
                    {
                        label: 'United States',
                        data: [2.4, 1.8, 1.2, 4.7, 8.0, 4.1],
                        borderColor: color1,
                        backgroundColor: color1 + '33',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'China',
                        data: [2.1, 2.9, 2.5, 0.9, 2.0, 0.7],
                        borderColor: color2,
                        backgroundColor: color2 + '33',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Germany',
                        data: [1.9, 1.4, 0.4, 3.2, 8.7, 6.0],
                        borderColor: color3,
                        backgroundColor: color3 + '33',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'India',
                        data: [3.4, 4.8, 6.2, 5.5, 6.7, 5.4],
                        borderColor: color4,
                        backgroundColor: color4 + '33',
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                ...multiLineTooltipCallback,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Inflation (Annual %)',
                            color: textColor,
                            font: { size: 14 }
                        },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    },
                }
            }
        });
    }

    const ctxUnemployment = document.getElementById('unemploymentBarChart');
    if(ctxUnemployment) {
        new Chart(ctxUnemployment, {
            type: 'bar',
            data: {
                labels: processedGdpLabels,
                datasets: [{
                    label: 'Unemployment Rate (%)',
                    data: [3.6, 3.8, 3.1, 7.9],
                    backgroundColor: [color1, color2, color3, color4],
                }]
            },
            options: {
                ...multiLineTooltipCallback,
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Unemployment Rate (%)',
                            color: textColor,
                            font: { size: 14 }
                        },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 12 } }
                    }
                }
            }
        });
    }

    const ctxScatter = document.getElementById('scatterPlot');
    if(ctxScatter) {
        new Chart(ctxScatter, {
            type: 'scatter',
            data: {
                labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'USA (Inflation vs. Unemployment)',
                    data: [
                        {x: 6.2, y: 1.6},
                        {x: 5.3, y: 0.1},
                        {x: 4.9, y: 1.3},
                        {x: 4.4, y: 2.1},
                        {x: 3.9, y: 2.4},
                        {x: 3.7, y: 1.8},
                        {x: 8.1, y: 1.2},
                        {x: 5.4, y: 4.7},
                        {x: 3.6, y: 8.0},
                        {x: 3.8, y: 4.1}
                    ],
                    backgroundColor: color2,
                }]
            },
            options: {
                ...multiLineTooltipCallback,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Unemployment Rate (%)',
                            color: textColor,
                            font: { size: 14 }
                        },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Inflation Rate (%)',
                            color: textColor,
                            font: { size: 14 }
                        },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }
});
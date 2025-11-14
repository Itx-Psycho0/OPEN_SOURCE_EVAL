window.addEventListener('DOMContentLoaded', () => {

    const predictButton = document.getElementById('predict-button');
    const countrySelect = document.getElementById('country-select');
    const gdpLag1Input = document.getElementById('gdp-lag1');
    const gdpLag2Input = document.getElementById('gdp-lag2');
    const gdpLag3Input = document.getElementById('gdp-lag3');
    
    const resultsSection = document.getElementById('results-section');
    const predictedGdpSpan = document.getElementById('predicted-gdp');
    const predictedCountrySpan = document.getElementById('predicted-country');
    const predictedYearSpan = document.getElementById('predicted-year');
    const errorMessage = document.getElementById('error-message');

    if (!predictButton || !countrySelect || !gdpLag1Input || !gdpLag2Input || !gdpLag3Input || !resultsSection || !predictedGdpSpan || !predictedCountrySpan || !predictedYearSpan || !errorMessage) {
        console.error('Required DOM elements not found');
        return;
    }

    predictButton.addEventListener('click', async () => {
        // Clear previous results and errors
        errorMessage.textContent = '';
        predictedGdpSpan.textContent = '';
        predictedCountrySpan.textContent = '';
        predictedYearSpan.textContent = '';
        resultsSection.classList.add('hidden');

        const countryName = countrySelect.value;
        const predictionYear = 2023; // Based on your model
        
        const gdpLag1 = parseFloat(gdpLag1Input.value);
        const gdpLag2 = parseFloat(gdpLag2Input.value);
        const gdpLag3 = parseFloat(gdpLag3Input.value);

        // Validate inputs
        if (!countryName || isNaN(gdpLag1) || isNaN(gdpLag2) || isNaN(gdpLag3)) {
            errorMessage.textContent = 'Please select a country and enter valid GDP lag values.';
            resultsSection.classList.remove('hidden');
            return;
        }

        const requestData = {
            country_name: countryName,
            prediction_year: predictionYear,
            gdp_lags: {
                GDP_lag_1: gdpLag1,
                GDP_lag_2: gdpLag2,
                GDP_lag_3: gdpLag3
            }
        };

        // Make API Call
        try {
            // Assumes your Flask app is running on http://127.0.0.1:5000
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();
            resultsSection.classList.remove('hidden');

            if (response.ok) {
                // Display Predictions
                const formattedGdp = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(result.predicted_gdp);

                predictedCountrySpan.textContent = result.country_name;
                predictedYearSpan.textContent = result.predicted_year;
                predictedGdpSpan.textContent = formattedGdp;
            } else {
                // Implement Error Handling
                errorMessage.textContent = `Error: ${result.error || 'Unknown API error'}`;
            }

        } catch (error) {
            console.error('Network or unexpected error:', error);
            resultsSection.classList.remove('hidden');
            errorMessage.textContent = 'Failed to connect to the prediction service. Make sure the Flask server is running.';
        }
    });
});

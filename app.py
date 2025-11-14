from flask import Flask, jsonify
import requests
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# This is our new "recipe book" (dictionary)
# It maps simple names to the real World Bank indicator codes
INDICATOR_MAP = {
    "gdp": "NY.GDP.MKTP.CD",          # GDP (Current US$)
    "inflation": "FP.CPI.TOTL.ZG",    # Inflation, consumer prices (annual %)
    "unemployment": "SL.UEM.TOTL.ZS"  # Unemployment, total (% of total labor force)
}

# We rename 'gdp' to 'value' for generic use
def clean_data_from_world_bank(data_list):
    df = pd.DataFrame(data_list)
    clean_df = df[['date', 'value']]
    clean_df = clean_df.rename(columns={"value": "value"}) # Keep it generic
    # Drop rows where 'value' is None (missing data)
    clean_df = clean_df.dropna(subset=['value'])
    return clean_df.to_dict('records')

def get_indicator_data(country_code, indicator):
    # Look up the real indicator code from our map
    indicator_code = INDICATOR_MAP.get(indicator)
    
    # If the indicator isn't in our map, return an error
    if not indicator_code:
        return {"error": "Invalid indicator"}, 400

    api_url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}?date=2000:2022&format=json"
    
    print(f"Fetching {indicator} for {country_code}...")

    try:
        response = requests.get(api_url)
        data = response.json()
        
        # data[1] holds the list of data points
        if data and len(data) > 1 and data[1]:
            return clean_data_from_world_bank(data[1]), 200
        else:
            # No data found for that country/indicator combo
            return [], 200

    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"error": f"Failed to fetch data: {e}"}, 500

@app.route("/")
def home():
    return "Economic Dashboard API is running."

# This is our new, all-in-one, dynamic route!
@app.route("/api/data/<indicator>/<country_code>")
def api_get_data(indicator, country_code):
    data, status_code = get_indicator_data(country_code.upper(), indicator.lower())
    return jsonify(data), status_code

if __name__ == "__main__":
    app.run(debug=True)
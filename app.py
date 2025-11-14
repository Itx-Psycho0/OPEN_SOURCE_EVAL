# Step 1: Import all the libraries we need
from flask import Flask, jsonify
import requests
import pandas as pd
from flask_cors import CORS  # <-- 1. IMPORT THIS

# Step 2: Create the Flask app
app = Flask(__name__)
CORS(app)  # <-- 2. ADD THIS LINE (this gives permission)

# Step 3: Create a function to get and clean the data
# (The rest of your file stays exactly the same)
def get_gdp_data():
    api_url = "http://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?date=2012:2022&format=json"
    print("Fetching data from World Bank API...")
    try:
        response = requests.get(api_url)
        data = response.json()
        data_list = data[1]
        df = pd.DataFrame(data_list)
        clean_df = df[['date', 'value']]
        clean_df = clean_df.rename(columns={"value": "gdp"})
        data_json = clean_df.to_dict('records')
        return data_json
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"error": "Failed to fetch data"}

# Step 4: Define our API route
@app.route("/")
def home():
    return "Hello, World! My Flask server is running!"

@app.route("/api/gdp")
def api_gdp_data():
    print("API request received! Getting data...")
    data = get_gdp_data()
    return jsonify(data)

# Step 5: Run the app
if __name__ == "__main__":
    app.run(debug=True)
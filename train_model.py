import requests
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

print("Starting model training script...")

# 1. Define parameters
countries = ['US', 'GB', 'CN', 'IN', 'JP', 'DE', 'FR', 'CA', 'AU', 'BR', 'RU', 'ZA', 'MX', 'KR', 'ID']
gdp_indicator = 'NY.GDP.MKTP.CD'
start_year = 1960
end_year = 2022

print(f"Fetching data for {len(countries)} countries from {start_year} to {end_year}...")

# 2. Construct API URL
base_url = "http://api.worldbank.org/v2/country"
countries_str = ';'.join(countries)
api_url = f"{base_url}/{countries_str}/indicator/{gdp_indicator}?format=json&date={start_year}:{end_year}&per_page=10000"

print(f"API URL: {api_url}")

# 3. Fetch data
try:
    response = requests.get(api_url)
    response.raise_for_status() # Raise an exception for bad status codes
    print(f"API request status code: {response.status_code}")
    print("Successfully fetched data from World Bank API.")
    data = response.json()
    if len(data) > 1:
        gdp_data = data[1]
        print(f"Number of GDP records retrieved: {len(gdp_data)}")
    else:
        gdp_data = []
        print("No GDP data found in the response.")
except requests.exceptions.RequestException as e:
    print(f"Failed to fetch data: {e}")
    gdp_data = []

# 4. Create DataFrame
if gdp_data:
    parsed_data = []
    for record in gdp_data:
        country_name = record['country']['value']
        year = int(record['date'])
        gdp_value = record['value']
        parsed_data.append({'Country': country_name, 'Year': year, 'GDP': gdp_value})
    
    gdp_df = pd.DataFrame(parsed_data)
    print("GDP data successfully loaded into a pandas DataFrame.")
else:
    gdp_df = pd.DataFrame(columns=['Country', 'Year', 'GDP'])
    print("No data to create DataFrame. Exiting.")

# 5. Prepare Data (Only if DataFrame is not empty)
if not gdp_df.empty:
    print("\nStarting data preparation...")
    
    gdp_df.sort_values(by=['Country', 'Year'], inplace=True)
    print("DataFrame sorted by Country and Year.")
    
    print(f"Missing values before handling: {gdp_df['GDP'].isnull().sum()}")
    gdp_df['GDP'] = gdp_df.groupby('Country')['GDP'].ffill()
    print("GDP values forward-filled by Country.")
    
    initial_rows = gdp_df.shape[0]
    gdp_df.dropna(subset=['GDP'], inplace=True)
    if initial_rows > gdp_df.shape[0]:
        print(f"Dropped {initial_rows - gdp_df.shape[0]} rows with initial missing GDP values.")
    
    gdp_df['GDP_next_year'] = gdp_df.groupby('Country')['GDP'].shift(-1)
    gdp_df['GDP_lag_1'] = gdp_df.groupby('Country')['GDP'].shift(1)
    gdp_df['GDP_lag_2'] = gdp_df.groupby('Country')['GDP'].shift(2)
    gdp_df['GDP_lag_3'] = gdp_df.groupby('Country')['GDP'].shift(3)
    print("Created target and lag features.")
    
    initial_rows = gdp_df.shape[0]
    gdp_df.dropna(subset=['GDP_next_year', 'GDP_lag_1', 'GDP_lag_2', 'GDP_lag_3'], inplace=True)
    print(f"Dropped {initial_rows - gdp_df.shape[0]} rows with NaN values in new features.")
    
    gdp_df = pd.get_dummies(gdp_df, columns=['Country'], prefix='Country')
    print(f"Data prepared. Final shape for training: {gdp_df.shape}")

    # 6. Train Model
    print("\nStarting model training...")
    y = gdp_df['GDP_next_year']
    X = gdp_df.drop(columns=['GDP', 'GDP_next_year'])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("RandomForestRegressor model trained successfully.")

    # 7. Save the Model
    output_dir = 'ml_prediction'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    
    model_path = os.path.join(output_dir, 'gdp_prediction_model.pkl')
    joblib.dump(model, model_path)
    
    print(f"-------------------------------------------------------")
    print(f"SUCCESS: Trained model saved as '{model_path}'.")
    print(f"-------------------------------------------------------")

else:
    print("Cannot proceed with training as no data was fetched.")
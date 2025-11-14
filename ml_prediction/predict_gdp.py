import joblib
import pandas as pd
import numpy as np
import os # <-- NEW: Import os to handle file paths

# --- NEW: Define the path to the model file ---
MODEL_DIR = 'ml_prediction'
MODEL_FILE = 'gdp_prediction_model.pkl'
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILE)
# --- End of new path definition ---

def predict_gdp_for_country(country_name: str, prediction_year: int, gdp_lags: dict, trained_feature_columns: list) -> float:
    """
    Predicts the GDP for a given country and year using a pre-trained model.

    Args:
        country_name (str): The name of the country (e.g., 'United States').
        prediction_year (int): The year for which to predict GDP.
        gdp_lags (dict): A dictionary containing the last three historical GDP values.
                         Example: {'GDP_lag_1': value1, 'GDP_lag_2': value2, 'GDP_lag_3': value3}
        trained_feature_columns (list): A list of feature columns used during model training.

    Returns:
        float: The predicted GDP for the specified country and year.
    """
    # Load the trained model from the new path
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Error: Model file not found at {MODEL_PATH}. Make sure 'gdp_prediction_model.pkl' is inside the 'ml_prediction' folder.")
    
    model = joblib.load(MODEL_PATH) # <-- MODIFIED: Uses MODEL_PATH

    # Prepare the input data for prediction
    prediction_data = {
        'Year': prediction_year,
        'GDP_lag_1': gdp_lags['GDP_lag_1'],
        'GDP_lag_2': gdp_lags['GDP_lag_2'],
        'GDP_lag_3': gdp_lags['GDP_lag_3']
    }

    # Initialize all country one-hot encoded columns to False
    for col in trained_feature_columns:
        if col.startswith('Country_'):
            prediction_data[col] = False

    # Set the specific country's one-hot encoded column to True
    country_col_name = f'Country_{country_name}'
    if country_col_name in trained_feature_columns:
        prediction_data[country_col_name] = True
    else:
        raise ValueError(f"Country '{country_name}' was not present in the training data.")

    # Create a DataFrame from the prediction data
    X_predict = pd.DataFrame([prediction_data])

    # Ensure the columns of X_predict match the training features (X.columns) and their order
    # Drop any extra columns in X_predict that were not in trained_feature_columns
    extra_cols_in_predict = set(X_predict.columns) - set(trained_feature_columns)
    if extra_cols_in_predict:
        X_predict = X_predict.drop(columns=list(extra_cols_in_predict))

    # Add any missing columns from trained_feature_columns to X_predict as False (for one-hot encoded countries)
    missing_cols_in_predict = set(trained_feature_columns) - set(X_predict.columns)
    for col in missing_cols_in_predict:
        X_predict[col] = False

    X_predict = X_predict[trained_feature_columns] # Reorder columns to match trained features

    # Make prediction
    predicted_gdp = model.predict(X_predict)

    return predicted_gdp[0]

if __name__ == '__main__':
    # Example usage:

    # These are the columns that were used to train the model, derived from the X dataframe.
    # In a real scenario, this list would be passed or loaded from a configuration.
    trained_feature_columns = ['Year', 'GDP_lag_1', 'GDP_lag_2', 'GDP_lag_3',
                               'Country_Australia', 'Country_Brazil', 'Country_Canada', 'Country_China',
                               'Country_France', 'Country_Germany', 'Country_India', 'Country_Indonesia',
                               'Country_Japan', 'Country_Korea, Rep.', 'Country_Mexico',
                               'Country_Russian Federation', 'Country_South Africa',
                               'Country_United Kingdom', 'Country_United States']

    # Sample data for prediction (using data from the latest year in the notebook for United States)
    sample_country = 'United States'
    sample_prediction_year = 2023
    sample_gdp_lags = {
        'GDP_lag_1': 2.60068930000000e+13,  # Latest GDP (2022)
        'GDP_lag_2': 2.36811710000000e+13,  # GDP from 2021
        'GDP_lag_3': 2.13541050000000e+13   # GDP from 2020
    }

    try:
        predicted_gdp = predict_gdp_for_country(
            sample_country, sample_prediction_year, sample_gdp_lags, trained_feature_columns
        )
        print(f"Predicted GDP for {sample_country} in {sample_prediction_year}: ${predicted_gdp:,.2f}")
    except (ValueError, FileNotFoundError) as e: # <-- MODIFIED: Added FileNotFoundError
        print(f"Error: {e}")

    # Another example for a different country
    sample_country_cn = 'China'
    sample_prediction_year_cn = 2023
    sample_gdp_lags_cn = {
        'GDP_lag_1': 1.83167720000000e+13,  # Latest GDP (2022)
        'GDP_lag_2': 1.82017040000000e+13,  # GDP from 2021
        'GDP_lag_3': 1.49964060000000e+13   # GDP from 2020
    }

    try:
        predicted_gdp_cn = predict_gdp_for_country(
            sample_country_cn, sample_prediction_year_cn, sample_gdp_lags_cn, trained_feature_columns
        )
        print(f"Predicted GDP for {sample_country_cn} in {sample_prediction_year_cn}: ${predicted_gdp_cn:,.2f}")
    except (ValueError, FileNotFoundError) as e: # <-- MODIFIED: Added FileNotFoundError
        print(f"Error: {e}")
from flask import Flask, request, jsonify, send_from_directory
from ml_prediction.predict_gdp import predict_gdp_for_country
from flask_cors import CORS
import os
import logging

# Configure logging to file and console for easier debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
# Enable CORS so the frontend (served on a different port/origin) can call this API
CORS(app)
# This list must be identical to the one used during model training
trained_feature_columns = ['Year', 'GDP_lag_1', 'GDP_lag_2', 'GDP_lag_3',
                           'Country_Australia', 'Country_Brazil', 'Country_Canada', 'Country_China',
                           'Country_France', 'Country_Germany', 'Country_India', 'Country_Indonesia',
                           'Country_Japan', 'Country_Korea, Rep.', 'Country_Mexico',
                           'Country_Russian Federation', 'Country_South Africa',
                           'Country_United Kingdom', 'Country_United States']

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')


@app.route('/predict.html')
def predict_page():
    return send_from_directory('.', 'predict.html')


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    # Log incoming requests for easier debugging
    try:
        logging.info(f"[predict] Incoming request from {request.remote_addr}: {data}")
    except Exception:
        logging.info(f"[predict] Incoming request (unable to get remote_addr). Data: {data}")

    try:
        country_name = data['country_name']
        prediction_year = data['prediction_year']
        gdp_lags = data['gdp_lags'] 

        predicted_gdp = predict_gdp_for_country(
            country_name, prediction_year, gdp_lags, trained_feature_columns
        )

        return jsonify({
            'country': country_name,
            'prediction_year': prediction_year,
            'predicted_gdp': predicted_gdp
        })
    except KeyError as e:
        return jsonify({'error': f'Missing data field: {e}'}), 400
    except (ValueError, FileNotFoundError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.exception(f"[predict] Unexpected error: {e}")
        return jsonify({'error': f'An unexpected error occurred: {e}'}), 500


if __name__ == '__main__':
    # Add a simple print statement to show it's running
    print("Starting Flask server on http://127.0.0.1:5000")
    print("Press CTRL+C to stop the server.")
    app.run(host='0.0.0.0', port=5000)

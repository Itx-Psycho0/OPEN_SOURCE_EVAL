from predict_app import app
import json

# Use Flask test client to call /predict without running an external server
with app.test_client() as client:
    payload = {
        "country_name": "United States",
        "prediction_year": 2023,
        "gdp_lags": {
            "GDP_lag_1": 26006893000000,
            "GDP_lag_2": 23681171000000,
            "GDP_lag_3": 21354105000000
        }
    }

    resp = client.post('/predict', data=json.dumps(payload), content_type='application/json')
    print('Status code:', resp.status_code)
    try:
        print('JSON response:', resp.get_json())
    except Exception as e:
        print('Response data:', resp.data)

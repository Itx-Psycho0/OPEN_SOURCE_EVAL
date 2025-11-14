#!/usr/bin/env python
"""Test script to verify all imports and components are working"""

import sys
print(f"Python version: {sys.version}")

try:
    import flask
    print("✓ Flask imported successfully")
except ImportError as e:
    print(f"✗ Flask import failed: {e}")

try:
    from ml_prediction.predict_gdp import predict_gdp_for_country
    print("✓ predict_gdp_for_country imported successfully")
except ImportError as e:
    print(f"✗ predict_gdp_for_country import failed: {e}")

try:
    import joblib
    print("✓ joblib imported successfully")
except ImportError as e:
    print(f"✗ joblib import failed: {e}")

try:
    import pandas as pd
    print("✓ pandas imported successfully")
except ImportError as e:
    print(f"✗ pandas import failed: {e}")

try:
    import sklearn
    print("✓ scikit-learn imported successfully")
except ImportError as e:
    print(f"✗ scikit-learn import failed: {e}")

import os
model_path = os.path.join('ml_prediction', 'gdp_prediction_model.pkl')
if os.path.exists(model_path):
    print(f"✓ Model file exists at {model_path}")
else:
    print(f"✗ Model file NOT found at {model_path}")

print("\n=== All checks completed ===")

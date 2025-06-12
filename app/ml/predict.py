import pickle
import pandas as pd
from flask import Blueprint, request, jsonify
import os

ml_routes = Blueprint('ml_routes', __name__)

# Load the model
model = None
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

def load_model():
    global model
    if model is None and os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            model = pickle.load(f)

@ml_routes.before_app_first_request
def initialize():
    load_model()

@ml_routes.route('/api/predict-size', methods=['POST'])
def predict_size():
    try:
        # Get input data from request
        data = request.get_json()
        required_fields = [
            'височина', 'тегло', 'талия', 'гръдна_обиколка', 'ширина_дреха',
            'пол', 'телосложение', 'материя', 'тип_дреха'
        ]
        
        # Validate input
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Create DataFrame from input
        input_df = pd.DataFrame([data])
        
        # Make prediction
        if model is None:
            load_model()
            if model is None:
                return jsonify({'error': 'Model not loaded'}), 500
            
        predicted_size = model.predict(input_df)[0]
        
        return jsonify({
            'predicted_size': predicted_size,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
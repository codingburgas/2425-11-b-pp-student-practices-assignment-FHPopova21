from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np
import os
import logging
import traceback
import pickle
from sklearn.preprocessing import LabelEncoder, StandardScaler

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load model and preprocessing objects
try:
    model_data = joblib.load('app/ml/model.pkl')
    model = model_data['model']
    scaler = model_data['scaler']
    label_encoders = model_data['label_encoders']
    numerical_features = model_data['numerical_features']
    categorical_features = model_data['categorical_features']
    
    logger.info("Model loaded successfully")
    logger.debug(f"Feature names: {numerical_features + categorical_features}")
    logger.debug(f"Label encoders: {list(label_encoders.keys())}")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

EN_TO_BG = {
    "height": "височина",
    "weight": "тегло",
    "waist": "талия",
    "chest": "гръдна_обиколка",
    "garment_width": "ширина_дреха",
    "gender": "пол",
    "body_type": "телосложение",
    "material": "материя",
    "garment_type": "тип_дреха"
}

def translate_to_bg(data):
    """
    Превежда ключовете на речник от английски на български според EN_TO_BG.
    :param data: Речник с данни
    :return: Нов речник с преведени ключове
    """
    return {EN_TO_BG.get(k, k): v for k, v in data.items()}

def predict_size(data):
    try:
        # Normalize field names
        field_mapping = {
            'clothing_width': 'garment_width',
            'clothing_type': 'garment_type'
        }
        
        normalized_data = {}
        for key, value in data.items():
            normalized_key = field_mapping.get(key, key)
            normalized_data[normalized_key] = value
            
        # Prepare numerical features
        numerical_data = np.array([[float(normalized_data[feature]) for feature in numerical_features]])
        numerical_data = scaler.transform(numerical_data)
        
        # Prepare categorical features
        categorical_data = []
        for feature in categorical_features:
            value = normalized_data[feature]
            if feature in label_encoders:
                try:
                    encoded_value = label_encoders[feature].transform([value])[0]
                    categorical_data.append(encoded_value)
                except ValueError as e:
                    logger.error(f"Unseen value '{value}' for feature {feature}")
                    logger.error(f"Available categories: {label_encoders[feature].classes_}")
                    raise ValueError(f"Unseen value '{value}' for feature {feature}. Available categories: {label_encoders[feature].classes_}")
            else:
                logger.error(f"No label encoder found for feature {feature}")
                raise ValueError(f"No label encoder found for feature {feature}")
        
        # Combine features
        categorical_data = np.array([categorical_data])
        X = np.column_stack([numerical_data, categorical_data])
        
        # Make prediction with calibrated probabilities
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]
        confidence = probabilities.max()
        
        # Get alternative size if confidence is below threshold
        alternative_size = None
        alternative_confidence = None
        if confidence < 0.8:  # 80% confidence threshold
            # Get second highest probability
            sorted_probs = np.argsort(probabilities)[::-1]
            if len(sorted_probs) > 1:
                alternative_size = model.classes_[sorted_probs[1]]
                alternative_confidence = probabilities[sorted_probs[1]]
        
        logger.debug(f"Prediction: {prediction}, Confidence: {confidence}")
        logger.debug(f"Alternative size: {alternative_size}, Confidence: {alternative_confidence}")
        
        return prediction, confidence, alternative_size, alternative_confidence
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

def predict_size_with_confidence(measurements: dict):
    try:
        logging.debug("Received measurements for prediction: %s", measurements)
        measurements = translate_to_bg(measurements)
        logging.debug("Translated measurements for prediction: %s", measurements)
        
        features = []
        num_values = []
        cat_values = []
        
        # Prepare numerical features
        for feature in numerical_features:
            if feature in measurements:
                value = float(measurements[feature])
                num_values.append(value)
            else:
                logging.error("Missing required numerical feature: %s", feature)
                logging.error("Available features: %s", list(measurements.keys()))
                return None, None, None, None
                
        num_values_scaled = scaler.transform([num_values])[0]
        
        # Prepare categorical features
        for feature in categorical_features:
            if feature in measurements:
                value = measurements[feature]
                if feature in label_encoders:
                    try:
                        encoded = label_encoders[feature].transform([value])[0]
                        cat_values.append(float(encoded))
                    except ValueError as e:
                        logging.error("Error encoding %s value '%s': %s", feature, value, str(e))
                        logging.error("Available categories: %s", label_encoders[feature].classes_)
                        return None, None, None, None
                else:
                    logging.error("No label encoder for categorical feature: %s", feature)
                    return None, None, None, None
            else:
                logging.error("Missing required categorical feature: %s", feature)
                logging.error("Available features: %s", list(measurements.keys()))
                return None, None, None, None
                
        features = list(num_values_scaled) + cat_values
        features_array = np.array([features])
        
        # Get predictions with calibrated probabilities
        prediction = model.predict(features_array)[0]
        probabilities = model.predict_proba(features_array)[0]
        confidence = probabilities.max()
        
        # Get alternative size if confidence is below threshold
        alternative_size = None
        alternative_confidence = None
        if confidence < 0.8:  # 80% confidence threshold
            sorted_probs = np.argsort(probabilities)[::-1]
            if len(sorted_probs) > 1:
                alternative_size = model.classes_[sorted_probs[1]]
                alternative_confidence = probabilities[sorted_probs[1]]
        
        logging.info("Prediction result: %s with confidence %.3f", prediction, confidence)
        if alternative_size:
            logging.info("Alternative size: %s with confidence %.3f", alternative_size, alternative_confidence)
            
        return prediction, confidence, alternative_size, alternative_confidence
        
    except Exception as e:
        logging.error("Prediction error: %s", str(e))
        logging.error("Traceback: %s", traceback.format_exc())
        return None, None, None, None


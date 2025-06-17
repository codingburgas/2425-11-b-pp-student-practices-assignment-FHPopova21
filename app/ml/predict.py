from flask import Blueprint, request, jsonify
from app.ml.ml_model import predict_size
import logging
import traceback
from flask_cors import cross_origin

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        logger.debug(f"Received data: {data}")

        # Validate required fields
        required_fields = ['height', 'weight', 'waist', 'chest', 'gender', 
                         'body_type', 'material', 'garment_type', 'garment_width']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            logger.error(f"Missing required fields: {missing_fields}")
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Make prediction
        prediction, confidence, alternative_size, alternative_confidence = predict_size(data)
        
        if prediction is None:
            return jsonify({"error": "Failed to make prediction"}), 500
            
        response = {
            "size": prediction,
            "confidence": confidence
        }
        
        # Add alternative size if confidence is below threshold
        if alternative_size and alternative_confidence:
            response["alternative_size"] = alternative_size
            response["alternative_confidence"] = alternative_confidence
            response["explanation"] = f"Based on your measurements, we recommend size {prediction} with {confidence:.1%} confidence. However, size {alternative_size} is also a possibility with {alternative_confidence:.1%} confidence."
        else:
            response["explanation"] = f"Based on your measurements, we recommend size {prediction} with {confidence:.1%} confidence."
        
        logger.debug(f"Prediction response: {response}")
        return jsonify(response)

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Prediction failed: {error_msg}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": error_msg}), 500

@predict_bp.route('/api/recommendations', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_recommendations():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        logging.debug(f"Received recommendation data: {data}")
        logging.debug(f"Request JSON: {data}")
        measurements = data.get('measurements', {})
        logging.debug(f"Received measurements for prediction: {measurements}")
        clothing_type = data.get('clothingType', '').lower()
        default_widths = {
            'shirt': 55,
            'pants': 40,
            'jacket': 58,
            'dress': 45,
            'skirt': 38,
            'sweater': 54
        }
        measurements['garment_width'] = str(default_widths.get(clothing_type, 50))
        prediction_result = predict_size(measurements)
        if not prediction_result:
            logging.error("Prediction result is None in recommendations endpoint")
            return jsonify({'error': 'Failed to get size prediction'}), 500
        size, confidence = prediction_result
        logging.info(f"Prediction result: {size} with confidence {confidence}")
        recommendations = get_clothing_recommendations(
            data.get('clothingType'),
            size,
            data.get('itemIdentifier')
        )
        return jsonify({
            'size': size,
            'confidence': float(confidence),
            'recommendations': recommendations
        })
    except Exception as e:
        error_msg = str(e)
        logging.error(f"Error in recommendation endpoint: {error_msg}")
        logging.error(traceback.format_exc())
        return jsonify({'error': error_msg}), 500

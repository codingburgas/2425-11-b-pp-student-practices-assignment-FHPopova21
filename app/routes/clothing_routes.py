from flask import Blueprint, jsonify, request
from app.models import db, RecommendationHistory, Clothing
from flask_login import login_required, current_user
from app.ml.ml_model import predict_size
from app.logging_config import log_user_action, log_error, log_ai_recommendation, log_performance
import logging
import uuid
from datetime import datetime

clothing_bp = Blueprint('clothing_bp', __name__)
"""
Blueprint за всички маршрути, свързани с дрехи: препоръки, предсказване на размер, история.
"""
logger = logging.getLogger('clothing_bp')

@clothing_bp.route('/recommendations', methods=['POST'])
@login_required
def save_recommendation():
    try:
        data = request.get_json()
        logger.info(f"Received recommendation data for user: {current_user.id}")
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'measurements' not in data:
            return jsonify({'error': 'Missing measurements data'}), 400
        measurements = data['measurements']
        logger.debug(f"Processing measurements: {measurements}")
        recommended_size = data.get('recommendedSize')
        if not recommended_size:
            return jsonify({'error': 'Missing recommended size'}), 400
        item_identifier = data.get('itemIdentifier', str(uuid.uuid4()))
        logger.debug(f"Using item identifier: {item_identifier}")
        recommendation = RecommendationHistory(
            user_id=current_user.id,
            clothing_type=data.get('clothingType', 'general'),
            recommended_size=recommended_size,
            height=str(measurements.get('height')),
            weight=str(measurements.get('weight')),
            chest=str(measurements.get('chest')),
            waist=str(measurements.get('waist')),
            body_type=measurements.get('body_type'),
            item_identifier=item_identifier
        )
        db.session.add(recommendation)
        db.session.commit()
        log_ai_recommendation(
            current_user.id, 
            item_identifier, 
            measurements, 
            recommended_size
        )
        log_user_action("save_recommendation", current_user.id, f"Size: {recommended_size}")
        logger.info(f"Successfully saved recommendation for user {current_user.id}")
        return jsonify({
            'message': 'Recommendation saved successfully',
            'recommendation': recommendation.to_dict()
        }), 201
    except Exception as e:
        log_error(e, "Save recommendation error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@clothing_bp.route('/predict-size', methods=['POST'])
def predict_size_route():
    start_time = datetime.now()
    try:
        data = request.get_json()
        logger.info("Size prediction request received")
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        size = predict_size(data)
        if size is None:
            logger.error("Prediction failed - model returned None")
            return jsonify({'error': 'Prediction failed'}), 500
        duration = (datetime.now() - start_time).total_seconds()
        log_performance("size_prediction", duration, f"Result: {size}")
        logger.info(f"Size prediction successful: {size}")
        return jsonify({'predicted_size': size}), 200
    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds()
        log_performance("size_prediction", duration, "ERROR")
        log_error(e, "Size prediction error")
        return jsonify({'error': str(e)}), 500

@clothing_bp.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        logger.info("Size prediction request received")
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        size = predict_size(data)
        if size is None:
            logger.error("Prediction failed - model returned None")
            return jsonify({'error': 'Prediction failed'}), 500
        # size = (main_size, confidence, alt_size, alt_confidence)
        main_size, confidence, alt_size, alt_confidence = size
        return jsonify({
            "size": main_size,
            "confidence": float(confidence),
            "alternative_size": alt_size,
            "alternative_confidence": float(alt_confidence),
            "explanation": f"Based on your measurements, we recommend size {main_size} with {confidence:.1%} confidence. However, size {alt_size} is also a possibility with {alt_confidence:.1%} confidence."
        }), 200
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return jsonify({'error': str(e)}), 500 
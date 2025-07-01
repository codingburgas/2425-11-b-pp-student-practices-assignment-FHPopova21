from flask import Blueprint, jsonify, request
from app.models import User, db, BodyMeasurements, RecommendationHistory
from flask_login import login_required, current_user
from app.logging_config import log_user_action, log_error
import logging

user_bp = Blueprint('user_bp', __name__)
"""
Blueprint за всички потребителски маршрути: профил, мерки, препоръки, смяна на парола.
"""
logger = logging.getLogger('user_bp')

@user_bp.route('/user', methods=['GET'])
@login_required
def get_user():
    try:
        log_user_action("get_user_profile", current_user.id)
        return jsonify(current_user.to_dict()), 200
    except Exception as e:
        log_error(e, "Get user data error")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/user/recommendations', methods=['GET'])
@login_required
def get_user_recommendations():
    try:
        recommendations = RecommendationHistory.query.filter_by(user_id=current_user.id).order_by(RecommendationHistory.date.desc()).all()
        log_user_action("get_recommendation_history", current_user.id, f"Count: {len(recommendations)}")
        return jsonify([rec.to_dict() for rec in recommendations]), 200
    except Exception as e:
        log_error(e, "Get user recommendations error")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/user/measurements', methods=['GET'])
@login_required
def get_measurements():
    try:
        measurements = BodyMeasurements.query.filter_by(user_id=current_user.id).first()
        if not measurements:
            logger.info(f"No measurements found for user: {current_user.id}")
            return jsonify({'error': 'No measurements found'}), 404
        log_user_action("get_measurements", current_user.id)
        return jsonify(measurements.to_dict())
    except Exception as e:
        log_error(e, "Get measurements error")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/user/measurements', methods=['POST'])
@login_required
def save_measurements():
    try:
        data = request.get_json()
        logger.info(f"Received measurements data for user: {current_user.id}")
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        required_fields = ['height', 'weight', 'gender', 'chest', 'waist', 'bodyType']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field in measurements: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        existing_measurements = BodyMeasurements.query.filter_by(user_id=current_user.id).first()
        if existing_measurements:
            existing_measurements.height = float(data['height'])
            existing_measurements.weight = float(data['weight'])
            existing_measurements.gender = data['gender']
            existing_measurements.chest = float(data['chest'])
            existing_measurements.waist = float(data['waist'])
            existing_measurements.body_type = data['bodyType']
            existing_measurements.age = int(data['age']) if data.get('age') else None
            log_user_action("update_measurements", current_user.id, f"Height: {data['height']}, Weight: {data['weight']}")
            logger.info(f"Updated measurements for user: {current_user.id}")
        else:
            measurements = BodyMeasurements(
                user_id=current_user.id,
                height=float(data['height']),
                weight=float(data['weight']),
                gender=data['gender'],
                chest=float(data['chest']),
                waist=float(data['waist']),
                body_type=data['bodyType'],
                age=int(data['age']) if data.get('age') else None
            )
            db.session.add(measurements)
            log_user_action("create_measurements", current_user.id, f"Height: {data['height']}, Weight: {data['weight']}")
            logger.info(f"Created new measurements for user: {current_user.id}")
        db.session.commit()
        user = User.query.get(current_user.id)
        return jsonify({
            'message': 'Measurements saved successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        log_error(e, "Save measurements error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/user/change-password', methods=['POST'])
@login_required
def change_password():
    try:
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')
        if not old_password or not new_password or not confirm_new_password:
            return jsonify({'error': 'Всички полета са задължителни.'}), 400
        if not current_user.check_password(old_password):
            return jsonify({'error': 'Грешна текуща парола.'}), 400
        if new_password != confirm_new_password:
            return jsonify({'error': 'Новите пароли не съвпадат.'}), 400
        if len(new_password) < 6:
            return jsonify({'error': 'Новата парола трябва да е поне 6 символа.'}), 400
        current_user.set_password(new_password)
        db.session.commit()
        return jsonify({'message': 'Паролата е сменена успешно.'}), 200
    except Exception as e:
        log_error(e, 'Change password error')
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 
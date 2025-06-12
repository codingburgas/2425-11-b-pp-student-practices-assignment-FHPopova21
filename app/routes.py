from flask import Blueprint, jsonify, request
from .models import User, db, RecommendationHistory, BodyMeasurements
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from app.ml.ml_model import predict_size

import logging
import uuid

auth = Blueprint('auth', __name__)
logging.basicConfig(level=logging.DEBUG)

@auth.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logging.debug(f"Received registration data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        logging.debug(f"Successfully created user: {user.username}")
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        logging.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logging.debug(f"Received login data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            logging.debug(f"Successfully logged in user: {user.username}")
            return jsonify({
                'message': 'Logged in successfully',
                'user': user.to_dict()
            }), 200
        
        return jsonify({'error': 'Invalid username or password'}), 401
        
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/logout')
@login_required
def logout():
    try:
        username = current_user.username
        logout_user()
        logging.debug(f"Successfully logged out user: {username}")
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        logging.error(f"Error during logout: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/user')
@login_required
def get_user():
    try:
        return jsonify(current_user.to_dict()), 200
    except Exception as e:
        logging.error(f"Error getting user data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/user/recommendations')
@login_required
def get_user_recommendations():
    try:
        recommendations = RecommendationHistory.query.filter_by(user_id=current_user.id).order_by(RecommendationHistory.date.desc()).all()
        return jsonify([rec.to_dict() for rec in recommendations]), 200
    except Exception as e:
        logging.error(f"Error getting user recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/recommendations', methods=['POST'])
@login_required
def save_recommendation():
    try:
        data = request.get_json()
        logging.debug(f"Received recommendation data: {data}")
        
        if not data or 'measurements' not in data:
            return jsonify({'error': 'No data provided or missing measurements'}), 400
        
        measurements = data['measurements']

        # Предсказваме размер
        recommended_size = predict_size(measurements)
        if not recommended_size:
            return jsonify({'error': 'Could not predict size'}), 500

        item_identifier = data.get('itemIdentifier', str(uuid.uuid4()))

        recommendation = RecommendationHistory(
            user_id=current_user.id,
            clothing_type=data.get('clothingType', 'general'),
            recommended_size=recommended_size,
            height=str(measurements.get('height')),
            weight=str(measurements.get('weight')),
            chest=str(measurements.get('chest')),
            waist=str(measurements.get('waist')),
            body_type=measurements.get('bodyType'),
            item_identifier=item_identifier
        )
        
        db.session.add(recommendation)
        db.session.commit()

        return jsonify({
            'message': 'Recommendation saved successfully',
            'recommendation': recommendation.to_dict()
        }), 201

    except Exception as e:
        logging.error(f"Error saving recommendation: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth.route('/api/predict-size', methods=['POST'])
def predict_size_route():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Извикваме функцията за предсказване на размер
        size = predict_size(data)
        if size is None:
            return jsonify({'error': 'Prediction failed'}), 500
        
        return jsonify({'predicted_size': size}), 200

    except Exception as e:
        logging.error(f"Error during size prediction: {e}")
        return jsonify({'error': str(e)}), 500

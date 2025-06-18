from flask import Blueprint, jsonify, request
from .models import User, db, RecommendationHistory, BodyMeasurements
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from app.ml.ml_model import predict_size
from app.logging_config import log_user_action, log_error, log_ai_recommendation, log_performance
import logging
import uuid
from datetime import datetime

auth = Blueprint('auth', __name__)
logger = logging.getLogger('auth')

@auth.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Registration attempt for username: {data.get('username', 'unknown')}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Registration failed - missing field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            logger.warning(f"Registration failed - email already exists: {data['email']}")
            return jsonify({'error': 'Email already registered'}), 400
        if User.query.filter_by(username=data['username']).first():
            logger.warning(f"Registration failed - username already taken: {data['username']}")
            return jsonify({'error': 'Username already taken'}), 400
        
        # Set role to 'seller' if provided, otherwise default to 'user'
        role = data.get('role', 'user')
        if role not in ['user', 'seller']:
            logger.warning(f"Registration failed - invalid role: {role}")
            return jsonify({'error': 'Invalid role specified'}), 400
        
        user = User(
            username=data['username'],
            email=data['email'],
            role=role
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        log_user_action("user_registration", user.id, f"Role: {role}")
        logger.info(f"Successfully created user: {user.username} with role: {user.role}")
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        log_error(e, "Registration error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"Login attempt for username: {data.get('username', 'unknown')}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            log_user_action("user_login", user.id)
            logger.info(f"Successfully logged in user: {user.username}")
            return jsonify({
                'message': 'Logged in successfully',
                'user': user.to_dict()
            }), 200
        
        logger.warning(f"Failed login attempt for username: {data.get('username')}")
        return jsonify({'error': 'Invalid username or password'}), 401
        
    except Exception as e:
        log_error(e, "Login error")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/logout')
@login_required
def logout():
    try:
        username = current_user.username
        user_id = current_user.id
        logout_user()
        log_user_action("user_logout", user_id)
        logger.info(f"Successfully logged out user: {username}")
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        log_error(e, "Logout error")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/user')
@login_required
def get_user():
    try:
        log_user_action("get_user_profile", current_user.id)
        return jsonify(current_user.to_dict()), 200
    except Exception as e:
        log_error(e, "Get user data error")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/user/recommendations')
@login_required
def get_user_recommendations():
    try:
        recommendations = RecommendationHistory.query.filter_by(user_id=current_user.id).order_by(RecommendationHistory.date.desc()).all()
        log_user_action("get_recommendation_history", current_user.id, f"Count: {len(recommendations)}")
        return jsonify([rec.to_dict() for rec in recommendations]), 200
    except Exception as e:
        log_error(e, "Get user recommendations error")
        return jsonify({'error': str(e)}), 500

@auth.route('/api/recommendations', methods=['POST'])
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

        # Get the recommended size from the request data
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
        
        # Log AI recommendation
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

@auth.route('/api/predict-size', methods=['POST'])
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

@auth.route('/api/measurements', methods=['GET'])
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

@auth.route('/api/measurements', methods=['POST'])
@login_required
def save_measurements():
    try:
        data = request.get_json()
        logger.info(f"Received measurements data for user: {current_user.id}")

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['height', 'weight', 'gender', 'chest', 'waist', 'bodyType']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field in measurements: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Check if measurements already exist for this user
        existing_measurements = BodyMeasurements.query.filter_by(user_id=current_user.id).first()

        if existing_measurements:
            # Update existing measurements
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
            # Create new measurements
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

        # Get updated user data to return
        user = User.query.get(current_user.id)
        return jsonify({
            'message': 'Measurements saved successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        log_error(e, "Save measurements error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
from flask import Blueprint, jsonify, request
from .models import User, db, RecommendationHistory, BodyMeasurements
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
import logging

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
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
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

@auth.route('/api/measurements', methods=['POST'])
@login_required
def save_measurements():
    try:
        data = request.get_json()
        logging.debug(f"Received measurements data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['height', 'weight', 'gender', 'chest', 'waist', 'bodyType']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Convert bodyType to body_type for database
        data['body_type'] = data.pop('bodyType')
        
        # Check if user already has measurements
        measurements = BodyMeasurements.query.filter_by(user_id=current_user.id).first()
        
        if measurements:
            # Update existing measurements
            for key, value in data.items():
                setattr(measurements, key, value)
        else:
            # Create new measurements
            measurements = BodyMeasurements(user_id=current_user.id, **data)
            db.session.add(measurements)
        
        db.session.commit()
        logging.debug(f"Successfully saved measurements for user: {current_user.username}")
        
        return jsonify({
            'message': 'Measurements saved successfully',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        logging.error(f"Error saving measurements: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth.route('/api/measurements', methods=['GET'])
@login_required
def get_measurements():
    try:
        measurements = BodyMeasurements.query.filter_by(user_id=current_user.id).first()
        if measurements:
            return jsonify(measurements.to_dict()), 200
        return jsonify(None), 404
    except Exception as e:
        logging.error(f"Error getting measurements: {str(e)}")
        return jsonify({'error': str(e)}), 500
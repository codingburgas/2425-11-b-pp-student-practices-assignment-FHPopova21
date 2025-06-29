from flask import Blueprint, jsonify, request
from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user
from app.logging_config import log_user_action, log_error
import logging

auth_bp = Blueprint('auth_bp', __name__)
logger = logging.getLogger('auth_bp')

@auth_bp.route('/api/register', methods=['POST'])
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
        role = data.get('role', 'user')
        if role not in ['user', 'seller', 'admin']:
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

@auth_bp.route('/api/login', methods=['POST'])
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

@auth_bp.route('/api/logout')
def logout():
    try:
        logout_user()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        log_error(e, "Logout error")
        return jsonify({'error': str(e)}), 500 
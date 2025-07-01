from flask import Blueprint, jsonify, request, url_for, current_app
from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user
from app.logging_config import log_user_action, log_error
import logging
from app import mail
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
import os

auth_bp = Blueprint('auth_bp', __name__)
"""
Blueprint за всички маршрути, свързани с автентикация: регистрация, вход, изход, забравена парола и смяна на парола.
"""
logger = logging.getLogger('auth_bp')

@auth_bp.route('/api/register', methods=['POST'])
def register():
    """
    Регистрира нов потребител.
    Метод: POST
    Вход: JSON с username, email, password, role
    Изход: JSON със статус и съобщение
    """
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
    """
    Вход в системата.
    Метод: POST
    Вход: JSON с username и password
    Изход: JSON с данни за потребителя или грешка
    """
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
    """
    Изход от системата (logout).
    Метод: GET
    Изход: JSON със статус
    """
    try:
        logout_user()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        log_error(e, "Logout error")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """
    Изпраща имейл за възстановяване на парола.
    Метод: POST
    Вход: JSON с email
    Изход: JSON със статус
    """
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
    if user:
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        token = serializer.dumps(user.email, salt='password-reset-salt')
        reset_url = url_for('auth_bp.reset_password', token=token, _external=True)
        msg = Message('Reset your SmartFit password', recipients=[user.email])
        msg.body = f"Hello {user.username},\n\nClick the link to reset your password: {reset_url}\n\nIf you did not request this, ignore this email."
        try:
            mail.send(msg)
            logger.info(f"Sent password reset email to {user.email}")
        except Exception as e:
            logger.error(f"Failed to send reset email: {e}")
            return jsonify({'error': 'Failed to send email'}), 500
    # Always respond with success for security
    return jsonify({'message': 'If the email is registered, a reset link has been sent.'}), 200

@auth_bp.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    """
    Смяна на парола чрез токен от имейл.
    Метод: POST
    Вход: JSON с нова парола и потвърждение
    Изход: JSON със статус
    """
    data = request.get_json()
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    if not password or not confirm_password:
        return jsonify({'error': 'All fields are required.'}), 400
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=1800)  # 30 min
    except SignatureExpired:
        return jsonify({'error': 'The reset link has expired.'}), 400
    except BadSignature:
        return jsonify({'error': 'Invalid or tampered reset link.'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    user.set_password(password)
    db.session.commit()
    logger.info(f"Password reset for user {user.username}")
    return jsonify({'message': 'Password has been reset successfully.'}), 200 
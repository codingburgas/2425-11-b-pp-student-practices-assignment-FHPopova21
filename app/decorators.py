from functools import wraps
from flask import jsonify
from flask_login import current_user

def seller_required(f):
    """
    Декоратор, който позволява достъп само на потребители с роля 'seller'.
    :param f: Функцията, която се декорира
    :return: Декорирана функция
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'seller':
            return jsonify({'error': 'Seller access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """
    Декоратор, който позволява достъп само на потребители с роля 'admin'.
    :param f: Функцията, която се декорира
    :return: Декорирана функция
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function 
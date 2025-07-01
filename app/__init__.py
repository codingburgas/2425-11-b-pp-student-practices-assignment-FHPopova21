import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_mail import Mail


db = SQLAlchemy()
mail = Mail()

def create_app():
    """
    Създава и конфигурира Flask приложението, инициализира разширенията и регистрира всички blueprints.
    :return: Инициализирано Flask приложение
    """
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)
    mail.init_app(app)
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.clothing_routes import clothing_bp
    from app.routes.comment_routes import comment_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(clothing_bp, url_prefix='/api')
    app.register_blueprint(comment_bp, url_prefix='/api')
    return app 
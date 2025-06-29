from flask_sqlalchemy import SQLAlchemy
from flask import Flask

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
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
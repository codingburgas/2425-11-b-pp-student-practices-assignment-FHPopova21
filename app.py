from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from app.models import db, User, Clothing, Comment
from app.routes import auth
from app.ml.predict import predict_bp
from app.logging_config import setup_logging, log_user_action, log_error
from app.seed import seed_database
import os

app = Flask(__name__)

# Настройване на логването
logger = setup_logging(app)

# Configure CORS
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:8080", "http://localhost:3000", "http://192.168.0.128:8080"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Ensure the instance folder exists
os.makedirs(app.instance_path, exist_ok=True)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'SmartFit.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Ensure SECRET_KEY is set for token generation
if not app.config.get('SECRET_KEY'):
    app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    try:
        user = User.query.get(int(user_id))
        logger.debug(f"Loaded user: {user.username if user else 'None'}")
        return user
    except Exception as e:
        log_error(e, f"Error loading user with ID: {user_id}")
        return None

# Root route for API information
@app.route('/')
def index():
    logger.info("API root endpoint accessed")
    return jsonify({
        'name': 'SmartFit API',
        'version': '1.0',
        'endpoints': {
            'register': '/api/register',
            'login': '/api/login',
            'logout': '/api/logout',
            'user': '/api/user',
            'predict-size': '/api/predict-size'
        }
    })

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(predict_bp)
logger.info("Registered blueprints: auth and predict")

# Create database tables and seed data
with app.app_context():
    db.create_all()
    try:
        seed_database()
        logger.info("Database seeded successfully")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

if __name__ == '__main__':
    logger.info("Starting SmartFit application on port 5001")
    app.run(debug=True, host='0.0.0.0', port=5001)

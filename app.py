from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from app.models import db, User
from app.routes import auth
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

# Configure CORS
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:8080", "http://192.168.0.128:8080"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Ensure the instance folder exists
os.makedirs(app.instance_path, exist_ok=True)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'SmartFit.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here' 

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Root route for API information
@app.route('/')
def index():
    return jsonify({
        'name': 'SmartFit API',
        'version': '1.0',
        'endpoints': {
            'register': '/api/register',
            'login': '/api/login',
            'logout': '/api/logout',
            'user': '/api/user'
        }
    })

# Register blueprints
app.register_blueprint(auth)
logging.debug("Registered auth blueprint with routes: %s", [str(rule) for rule in app.url_map.iter_rules()])

# Create database tables
with app.app_context():
    db.create_all()
    logging.debug("Created database tables")

if __name__ == '__main__':
    app.run(debug=True, port=5001)

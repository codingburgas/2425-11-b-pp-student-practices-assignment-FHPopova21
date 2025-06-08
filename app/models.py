from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import SelectField, FloatField, IntegerField, SubmitField, StringField
from wtforms.validators import DataRequired
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from . import db
from datetime import datetime

class BodyMeasurements(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    height = db.Column(db.Float, nullable=False)  # in cm
    weight = db.Column(db.Float, nullable=False)  # in kg
    gender = db.Column(db.String(10), nullable=False)  # 'male' or 'female'
    chest = db.Column(db.Float, nullable=False)  # in cm
    waist = db.Column(db.Float, nullable=False)  # in cm
    body_type = db.Column(db.String(20), nullable=False)  # 'slim', 'medium', or 'large'
    age = db.Column(db.Integer)  # optional
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'height': self.height,
            'weight': self.weight,
            'gender': self.gender,
            'chest': self.chest,
            'waist': self.waist,
            'bodyType': self.body_type,
            'age': self.age
        }

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')  # 'user', 'merchant', or 'admin'
    recommendations = db.relationship('RecommendationHistory', backref='user', lazy=True)
    body_measurements = db.relationship('BodyMeasurements', backref='user', uselist=False, lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'name': self.username,  # Adding name field for frontend compatibility
            'bodyMeasurements': self.body_measurements.to_dict() if self.body_measurements else None
        }

class RecommendationHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    clothing_type = db.Column(db.String(50), nullable=False)
    recommended_size = db.Column(db.String(10), nullable=False)
    height = db.Column(db.String(10))
    weight = db.Column(db.String(10))
    chest = db.Column(db.String(10))
    waist = db.Column(db.String(10))
    body_type = db.Column(db.String(20))
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'clothingType': self.clothing_type,
            'recommendedSize': self.recommended_size,
            'measurements': {
                'height': self.height,
                'weight': self.weight,
                'chest': self.chest,
                'waist': self.waist,
                'bodyType': self.body_type
            }
        }
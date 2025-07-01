from flask import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, validators
from wtforms.validators import DataRequired, Length, Email

class RegisterForm(FlaskForm):
    """
    Форма за регистрация на нов потребител.
    """
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=2, max=30)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(min=2, max=30)])
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=30)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=35)])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    """
    Форма за вход на потребител.
    """
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=25)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=35)])
    submit = SubmitField('Sign In')



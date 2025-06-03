from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import db
from app.routes import main

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdb.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db.init_app(app)

app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True)

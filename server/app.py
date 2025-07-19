from flask import Flask
from flask_cors import CORS
import bcrypt
from db_manager import DBManager
from auth import create_auth_blueprint
from services import create_services_blueprint
from user_profile import create_profile_blueprint
from stats import create_stats_blueprint
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env

app = Flask(__name__)

# Autoriser CORS sur toute l'application
CORS(app, origins="*")  # remplacer * par l'addresse du site web quand en production

# MySQL configurations from environment variables
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

db = DBManager(app)

app.register_blueprint(create_auth_blueprint(db))
app.register_blueprint(create_services_blueprint(db))
app.register_blueprint(create_profile_blueprint(db))
app.register_blueprint(create_stats_blueprint(), url_prefix='/stats')

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)

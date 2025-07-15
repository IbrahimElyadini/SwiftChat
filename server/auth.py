from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from stats_logger import log_event

def create_auth_blueprint(db):
    auth_bp = Blueprint('auth', __name__)

    @auth_bp.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password'].encode('utf-8')

        # Vérifie si l'utilisateur existe déjà
        if db.user_exists(username, email):
            return jsonify({"error": "User already exists"}), 409

        hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())
        db.add_user(username, email, hashed_pw)

        # recuperation de l'ID de l'utilisateur nouvellement créé
        user = db.get_user_by_username(username)
        if not user:
            return jsonify({"error": "User registration failed"}), 500

        return jsonify({
            "message": "User registered successfully",
            "user_id": user[0],
            "username": user[1],
            "email": user[2]
        }), 201

    @auth_bp.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data['username']
        password = data['password'].encode('utf-8')

        user = db.get_user_by_username(username)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        stored_hash = user[3].encode('utf-8')  # password_hash column
        if bcrypt.checkpw(password, stored_hash):
            log_event("login", user_id=user[0])
            return jsonify({
                "message": "Login successful",
                "user_id": user[0],
                "username": user[1],
                "email": user[2]
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401

    return auth_bp
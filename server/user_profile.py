from flask import Blueprint, request, jsonify
import bcrypt
from stats_logger import log_event

def create_profile_blueprint(db):
    profile_bp = Blueprint('profile', __name__)

    @profile_bp.route('/profile/<int:user_id>', methods=['GET'])
    def get_profile(user_id):
        user = db.get_user_profile(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        log_event("get_profile", user_id=user_id)
        return jsonify({
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "avatar": user[3],
            "bio": user[4]
        })

    @profile_bp.route('/profile/<int:user_id>', methods=['PUT'])
    def update_profile(user_id):
        data = request.get_json()
        avatar = data.get('avatar')
        bio = data.get('bio')
        db.update_user_profile(user_id, avatar, bio)
        log_event("update_profile", user_id=user_id)
        return jsonify({"message": "Profile updated"})

    @profile_bp.route('/profile/<int:user_id>', methods=['DELETE'])
    def delete_profile(user_id):
        db.delete_user(user_id)
        log_event("delete_profile", user_id=user_id)
        return jsonify({"message": "User deleted"})

    @profile_bp.route('/profile/<int:user_id>/reset_password', methods=['POST'])
    def reset_password(user_id):
        data = request.get_json()
        new_password = data['new_password'].encode('utf-8')
        hashed_pw = bcrypt.hashpw(new_password, bcrypt.gensalt())
        db.update_user_password(user_id, hashed_pw)
        log_event("reset_password", user_id=user_id)
        return jsonify({"message": "Password updated"})

    return profile_bp
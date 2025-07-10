from flask import Blueprint, request, jsonify
from stats_logger import log_event

def create_services_blueprint(db):
    services_bp = Blueprint('services', __name__)

    @services_bp.route('/start_conversation', methods=['POST'])
    def start_conversation():
        data = request.get_json()
        user1_id = data['user1_id']
        user2_id = data['user2_id']

        user1 = db.get_user_by_id(user1_id)
        user2 = db.get_user_by_id(user2_id)

        if not user1 or not user2:
            return jsonify({"error": "One or both users not found"}), 404

        username1 = user1[0]
        username2 = user2[0]

        existing = db.conversation_exists(user1_id, user2_id)
        if existing:
            return jsonify({"message": "Conversation already exists", "conversation_id": existing[0]}), 200

        participants = sorted([username1, username2])
        conversation_name = f"{participants[0]} - {participants[1]}"
        conversation_id = db.create_conversation(conversation_name, user1_id, user2_id)

        return jsonify({
            "message": "Conversation started",
            "conversation_id": conversation_id,
            "name": conversation_name
        }), 201

    @services_bp.route('/send_message', methods=['POST'])
    def send_message():
        data = request.get_json()
        conversation_id = data['conversation_id']
        sender_id = data['sender_id']
        message = data['message']

        if not db.conversation_id_exists(conversation_id):
            return jsonify({"error": "Conversation does not exist"}), 404

        if not db.is_user_in_conversation(sender_id, conversation_id):
            return jsonify({"error": "Sender is not a member of this conversation"}), 403

        db.send_message(conversation_id, sender_id, message)
        log_event("send_message", user_id=sender_id, conversation_id=conversation_id)
        return jsonify({"message": "Message sent"}), 201

    @services_bp.route('/messages/<int:conversation_id>', methods=['GET'])
    def get_messages(conversation_id):
        user_id = request.args.get('user_id', type=int)
        if user_id is None:
            return jsonify({"error": "user_id is required"}), 400

        if not db.conversation_id_exists(conversation_id):
            return jsonify({"error": "Conversation does not exist"}), 404

        if not db.is_user_in_conversation(user_id, conversation_id):
            return jsonify({"error": "User is not a member of this conversation"}), 403

        messages = db.get_messages(conversation_id)
        msgs = [{"sender_id": m[0], "message": m[1], "sent_at": str(m[2])} for m in messages]
        return jsonify(msgs)

    return services_bp
from flask_socketio import SocketIO, emit
from flask import request

socketio = SocketIO(cors_allowed_origins="*")

connected_users = {}      # user_id → sid
sid_to_user_id = {}       # sid → user_id

def init_socketio(app):
    socketio.init_app(app)

    @socketio.on('connect')
    def on_connect():
        print(f"Client connected: {request.sid}")

    @socketio.on('identify')
    def on_identify(data):
        user_id = str(data.get('user_id'))
        if user_id:
            connected_users[user_id] = request.sid
            sid_to_user_id[request.sid] = user_id
            print(f"User {user_id} identified with sid {request.sid}")
            emit('identify_response', {'status': 'ok', 'user_id': user_id})
        else:
            print("identify event missing user_id")
            emit('identify_response', {'status': 'error', 'reason': 'missing user_id'})

    @socketio.on('disconnect')
    def on_disconnect():
        sid = request.sid
        user_id = sid_to_user_id.pop(sid, None)
        if user_id:
            connected_users.pop(user_id, None)
            print(f"User {user_id} disconnected")
        else:
            print(f"Unknown sid {sid} disconnected")

    @socketio.on('send_message')
    def on_send_message(data):
        sender_id = str(data.get('sender_id'))
        recipient_id = str(data.get('recipient_id'))
        message = data.get('content')

        if recipient_id in connected_users:
            recipient_sid = connected_users[recipient_id]
            emit('receive_message', {
                'sender_id': sender_id,
                'content': message
            }, to=recipient_sid)
            print(f"Message sent from {sender_id} to {recipient_id}")
        else:
            print(f"Recipient {recipient_id} not connected")
            emit('delivery_failed', {
                'recipient_id': recipient_id,
                'reason': 'not connected'
            }, to=request.sid)

    @socketio.on('create_conversation')
    def on_create_conversation(data):
    # Expected keys in data: conversation_id, user_id
        conversation_id = data.get('conversation_id')
        user_id = data.get('user_id')

        if not conversation_id or not user_id:
            emit('create_conversation_response', {'status': 'error', 'reason': 'Invalid data'})
            return

        # Notify the user involved in this conversation
        sid = connected_users.get(str(user_id))
        if sid:
            emit('new_conversation', {
                'conversation_id': conversation_id,
            }, to=sid)
            print(f"Notified user {user_id} about new conversation {conversation_id}")
            emit('create_conversation_response', {'status': 'ok'})
        else:
            print(f"User {user_id} not connected, cannot notify about new conversation {conversation_id}")
            emit('create_conversation_response', {'status': 'error', 'reason': 'user not connected'}, to=request.sid)


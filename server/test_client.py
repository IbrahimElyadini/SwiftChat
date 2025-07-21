import socketio
import time

# Create a Socket.IO client
sio = socketio.Client()

user_id = '1'

@sio.event
def connect():
    print('Connected to server')
    sio.emit('identify', {'user_id': user_id})
    
    time.sleep(1)  # Give server a moment to register
    recipient_id = '2'  # Recipient user
    sio.emit('send_message', {
        'sender_id': user_id,
        'recipient_id': recipient_id,
        'content': 'Hello from test client!'
    })

@sio.event
def connect_error(data):
    print("Connection failed:", data)

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.on('receive_message')
def on_receive_message(data):
    print(f"Message received: {data}")

# Connect to your local Flask server
sio.connect('http://127.0.0.1:5000')
sio.wait()

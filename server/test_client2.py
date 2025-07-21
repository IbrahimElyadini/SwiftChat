import socketio

# Create a Socket.IO client
sio = socketio.Client()

user_id = '2' # This user receives the message

@sio.event
def connect():
    print('Connected to server')
    sio.emit('identify', {'user_id': user_id})

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

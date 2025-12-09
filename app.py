# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key' # Replace with a strong secret key
socketio = SocketIO(app)

messages = [] # In-memory storage for messages
AI_SENDER_ID = 'gemini_ai'

def send_ai_reply(original_message):
    """Sends a delayed, canned reply from the AI."""
    print(f"Sending AI reply to: {original_message}")
    ai_reply_text = "Hii thiss is Manoj thank you for youing ichat"
    reply_data = {'text': ai_reply_text, 'senderId': AI_SENDER_ID}
    messages.append(reply_data)
    socketio.emit('message', reply_data) # Use socketio.emit for global context

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    # Ignore messages sent by the AI itself to prevent loops
    if data.get('senderId') == AI_SENDER_ID:
        return

    print(f"Received message: {data['text']} from {data['senderId']}")
    messages.append(data)
    emit('message', data, broadcast=True)

    # Schedule the AI to send a reply after a short delay
    threading.Timer(1.0, send_ai_reply, args=[data['text']]).start()

if __name__ == '__main__':
    socketio.run(app, debug=True)

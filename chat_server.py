from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app)

messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def post_message():
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
            
        # Validate required fields
        if 'message' not in data or not data['message']:
            return jsonify({'status': 'error', 'message': 'Message content is required'}), 400
            
        # Create new message with timestamp
        new_message = {
            'user': data.get('user', 'Anonymous'),
            'message': data.get('message', ''),
            'avatar': data.get('avatar', 'https://i.imgur.com/MZ3Wy6Y.gif'),
            'glitter': data.get('glitter', ''),
            'timestamp': data.get('timestamp', datetime.now().isoformat())
        }
        
        # Add to messages list
        messages.append(new_message)
        
        # Return the created message
        return jsonify(new_message)
    except Exception as e:
        error_details = str(e)
        traceback_details = traceback.format_exc()
        print(f"Error processing message: {error_details}\n{traceback_details}")
        return jsonify({
            'status': 'error', 
            'message': 'Server error processing message',
            'details': error_details
        }), 500

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def post_message():
    data = request.json
    messages.append({
        'user': data.get('user', 'Anonymous'),
        'message': data.get('message', ''),
        'avatar': data.get('avatar', 'https://i.imgur.com/MZ3Wy6Y.gif'),
        'glitter': data.get('glitter', '')
    })
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)


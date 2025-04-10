import requests
import urllib.parse
from flask import Flask, redirect, request, jsonify, session
from datetime import datetime

app = Flask(__name__)
app.secret_key = "200383027"

CLIENT_ID = "2d509f636a35473cbd76560f8ece4bf5"
CLIENT_SECRET = "2f0b14b6a3904c4aa2de25199d495be6"
REDIRECT_URI = "http://localhost:5000/callback"  

AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE_URL = "https://api.spotify.com/v1/"

@app.route('/')
def index():
    return "Welcome to my spotify app <a href='/login'>Login with Spotify</a>"

@app.route('/login')
def login():
    scope = 'user-read-private user-read-email user-top-read'
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'show_dialog': True
    }
    auth_url = f'{AUTH_URL}?{urllib.parse.urlencode(params)}'
    return jsonify({"auth_url": auth_url})

@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({'error': request.args['error']})

    if 'code' in request.args:
        req_body = {
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }

        response = requests.post(TOKEN_URL, data=req_body)
        token_info = response.json()

        if 'access_token' not in token_info:
            return jsonify({'error': 'Failed to get access token', 'details': token_info})

        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info.get('expires_in', 3600)

        return jsonify({"success": True, "access_token": token_info['access_token']})

    return jsonify({'error': 'Authorization code not found'})

@app.route('/top-artists')
def get_top_artists():
    if 'access_token' not in session:
        return jsonify({"error": "No access token"}), 401

    if datetime.now().timestamp() > session.get('expires_at', 0):
        return jsonify({"error": "Token expired"}), 401

    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }

    params = {
        'limit': 5,
        'time_range': 'long_term'
    }

    response = requests.get(
        f"{API_BASE_URL}me/top/artists",
        headers=headers,
        params=params
    )

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch top artists"}), response.status_code

    data = response.json()
    
    top_artists = [{
        'name': artist['name'],
        'genres': artist['genres'],
        'popularity': artist['popularity'],
        'image_url': artist['images'][0]['url'] if artist['images'] else None
    } for artist in data['items']]

    return jsonify({
        'top_artists': top_artists
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

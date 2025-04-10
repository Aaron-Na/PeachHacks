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
    return "Welcome to my Spotify app! <a href='/login'>Login with Spotify</a>"

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
    return redirect(auth_url)

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
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Token exchange failed',
                'status_code': response.status_code,
                'response': response.text
            })

        token_info = response.json()

        session['access_token'] = token_info.get('access_token')
        session['refresh_token'] = token_info.get('refresh_token')
        session['expires_at'] = datetime.now().timestamp() + token_info.get('expires_in', 3600)

        return redirect('/top-artists')

    return jsonify({'error': 'Authorization code not found'})

@app.route('/top-artists')
def get_top_artists():
    access_token = session.get('access_token')
    expires_at = session.get('expires_at', 0)

    if not access_token:
        return jsonify({"error": "No access token"}), 401

    if datetime.now().timestamp() > expires_at:
        return jsonify({"error": "Access token expired"}), 401

    headers = {
        'Authorization': f"Bearer {access_token}"
    }

    params = {
        'limit': 5,
        'time_range': 'long_term'
    }

    response = requests.get(f"{API_BASE_URL}me/top/artists", headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch top artists", "details": response.text}), response.status_code

    data = response.json()

    top_artists = [{
        'name': artist['name'],
        'genres': artist['genres'],
        'popularity': artist['popularity'],
        'image_url': artist['images'][0]['url'] if artist['images'] else None
    } for artist in data.get('items', [])]

    return jsonify({'top_artists': top_artists})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

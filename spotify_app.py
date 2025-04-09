
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
    return "Welcome to my Spotify app <a href='/login'>Login with Spotify</a>"

@app.route('/login')
def login():
    scope = 'user-read-private user-read-email user-read-currently-playing'
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
        token_info = response.json()

        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']

        return redirect('/playlists')
    
    return jsonify({'error': 'Authorization code not found'})

@app.route('/playlists')
def get_playlists():
    if 'access_token' not in session:
        return redirect('/login')
    
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }
    
    response = requests.get(API_BASE_URL + 'me/playlists', headers=headers)
    
    if response.status_code != 200:
        return redirect('/login')  # If token is expired, redirect to login
    
    playlists = response.json()
    return jsonify(playlists)

@app.route('/current-artist')
def current_artist():
    if 'access_token' not in session:
        return redirect('/login')

    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }

    response = requests.get(f"{API_BASE_URL}me/player/currently-playing", headers=headers)

    if response.status_code == 204:
        return jsonify({"message": "No track currently playing."})
    elif response.status_code != 200:
        return redirect('/login')  # If token is expired, redirect to login

    data = response.json()
    artist_name = data['item']['artists'][0]['name']
    track_name = data['item']['name']

    return jsonify({
        "artist": artist_name,
        "track": track_name
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

# app.py - Main application file
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
import uuid

app = Flask(__name__, static_folder='../public')
# Add CORS support
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/profile_images'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB max upload size
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Used for JWT tokens

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Define the relationship with friends
    friends = db.relationship(
        'Friend',
        foreign_keys='Friend.user_id',
        backref=db.backref('user', lazy='joined'),
        lazy='dynamic'
    )
    
    def __repr__(self):
        return f'<User {self.username}>'
        
    def is_friend_with(self, user_id):
        return Friend.query.filter_by(
            user_id=self.id,
            friend_id=user_id
        ).first() is not None

# Friend Model
class Friend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    friend = db.relationship('User', foreign_keys=[friend_id], lazy='joined')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'friend_id', name='unique_friendship'),
    )
    
    def __repr__(self):
        return f'<Friend {self.user_id} -> {self.friend_id}>'

# Create all tables
with app.app_context():
    db.create_all()

# Helper function to generate JWT tokens
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

# Routes
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    
    # Validate input
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password are required"}), 400
    
    # Check if username already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        password_hash=generate_password_hash(data['password']),
        description=data.get('description', '')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "description": new_user.description,
        "profile_image": new_user.profile_image,
        "created_at": new_user.created_at
    }), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "description": user.description,
        "profile_image": user.profile_image,
        "created_at": user.created_at
    })

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    
    if 'username' in data and data['username'] != user.username:
        # Check if new username already exists
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return jsonify({"error": "Username already exists"}), 409
        user.username = data['username']
    if 'password' in data:
        user.password_hash = generate_password_hash(data['password'])
    
    if 'description' in data:
        user.description = data['description']
    
    db.session.commit()
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "description": user.description,
        "profile_image": user.profile_image,
        "updated_at": user.updated_at
    })

@app.route('/api/users/<int:user_id>/profile-image', methods=['POST'])
def upload_profile_image(user_id):
    user = User.query.get_or_404(user_id)
    
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # Generate a unique filename
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Remove old profile image if exists
        if user.profile_image:
            old_filepath = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(user.profile_image))
            if os.path.exists(old_filepath):
                os.remove(old_filepath)
        
        file.save(filepath)
        
        # Update user record
        user.profile_image = f"/static/profile_images/{filename}"
        db.session.commit()
        
        return jsonify({
            "profile_image": user.profile_image
        })

@app.route('/api/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "username": user.username,
        "description": user.description,
        "profile_image": user.profile_image
    } for user in users])

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        "token": token,
        "user_id": user.id,
        "username": user.username
    })

# Friend endpoints
@app.route('/api/users/<int:user_id>/friends', methods=['GET'])
def get_friends(user_id):
    user = User.query.get_or_404(user_id)
    
    # Get all friends of the user
    friends_query = Friend.query.filter_by(user_id=user.id)
    friends = friends_query.all()
    
    friend_list = []
    for friend in friends:
        friend_user = User.query.get(friend.friend_id)
        if friend_user:
            friend_list.append({
                "id": friend_user.id,
                "username": friend_user.username,
                "description": friend_user.description,
                "profile_image": friend_user.profile_image
            })
    
    return jsonify(friend_list)

@app.route('/api/users/<int:user_id>/friends/<int:friend_id>', methods=['POST'])
def add_friend(user_id, friend_id):
    # Check if both users exist
    user = User.query.get_or_404(user_id)
    friend = User.query.get_or_404(friend_id)
    
    # Check if they're already friends
    existing = Friend.query.filter_by(user_id=user_id, friend_id=friend_id).first()
    if existing:
        return jsonify({"message": "Already friends"}), 200
    
    # Can't befriend yourself
    if user_id == friend_id:
        return jsonify({"error": "Cannot add yourself as a friend"}), 400
    
    # Create new friendship
    new_friendship = Friend(user_id=user_id, friend_id=friend_id)
    db.session.add(new_friendship)
    db.session.commit()
    
    return jsonify({
        "message": "Friend added successfully",
        "friend": {
            "id": friend.id,
            "username": friend.username,
            "profile_image": friend.profile_image
        }
    }), 201

@app.route('/api/users/<int:user_id>/friends/<int:friend_id>', methods=['DELETE'])
def remove_friend(user_id, friend_id):
    # Check if the friendship exists
    friendship = Friend.query.filter_by(user_id=user_id, friend_id=friend_id).first()
    
    if not friendship:
        return jsonify({"error": "Friendship not found"}), 404
    
    # Remove the friendship
    db.session.delete(friendship)
    db.session.commit()
    
    return jsonify({"message": "Friend removed successfully"}), 200

# Check friendship status
@app.route('/api/users/<int:user_id>/friends/<int:friend_id>/status', methods=['GET'])
def check_friendship(user_id, friend_id):
    friendship = Friend.query.filter_by(user_id=user_id, friend_id=friend_id).first()
    
    return jsonify({
        "is_friend": friendship is not None
    })

if __name__ == '__main__':
    app.run(debug=True)
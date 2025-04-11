# app.py - Main application file
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import time
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///peach_hacks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/profile_images'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB max upload size

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# Friendship association table
friendships = db.Table('friendships',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

# Friend Request Model
class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_requests')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_requests')

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    display_name = db.Column(db.String(80), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(500), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Friend relationship
    friends = db.relationship(
        'User', secondary=friendships,
        primaryjoin=(friendships.c.user_id == id),
        secondaryjoin=(friendships.c.friend_id == id),
        backref=db.backref('friend_of', lazy='dynamic'),
        lazy='dynamic'
    )

    def __repr__(self):
        return f'<User {self.username}>'

# Create all tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    # TODO: Replace with actual user ID from session
    user_id = 1
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get friend count
    friend_count = len(user.friends)
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "displayName": user.display_name,
        "bio": user.bio,
        "profilePic": user.profile_image,
        "stats": {
            "friends": friend_count,
            "playlists": 0,  # TODO: Implement playlist count
            "matches": 0  # TODO: Implement matches count
        }
    })

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    # TODO: Replace with actual user ID from session
    user_id = 1
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    if 'displayName' in data:
        user.display_name = data['displayName']
    if 'bio' in data:
        user.bio = data['bio']

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"})

@app.route('/api/profile/image', methods=['POST'])
def upload_profile_image():
    # TODO: Replace with actual user ID from session
    user_id = 1
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"user_{user_id}_{int(time.time())}{os.path.splitext(file.filename)[1]}")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        user.profile_image = f"/static/profile_images/{filename}"
        db.session.commit()
        
        return jsonify({
            "message": "Profile image updated successfully",
            "profilePic": user.profile_image
        })

    return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/friends', methods=['GET'])
def get_friends():
    try:
        # TODO: Replace with actual user ID from session
        user_id = 1
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        friends_list = [{
            "id": friend.id,
            "username": friend.username,
            "display_name": friend.display_name,
            "profile_image": friend.profile_image,
            "bio": friend.bio
        } for friend in user.friends]

        return jsonify({
            "friends": friends_list
        })
    except Exception as e:
        print(f"Error in get_friends: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/users/search', methods=['GET'])
def search_users():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Search for users with similar usernames
    users = User.query.filter(User.username.ilike(f'%{username}%')).limit(5).all()
    return jsonify({
        "users": [{
            "id": user.id,
            "username": user.username,
            "profile_image": user.profile_image
        } for user in users]
    })

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
    
    # Friend request endpoints
@app.route('/api/friend-request', methods=['POST'])
def send_friend_request():
    data = request.json
    if not data or not data.get('receiver_id'):
        return jsonify({"error": "Receiver ID is required"}), 400

    sender_id = 1  # TODO: Replace with actual authenticated user ID
    receiver_id = data['receiver_id']

    # Check if users exist
    sender = User.query.get(sender_id)
    receiver = User.query.get(receiver_id)
    if not sender or not receiver:
        return jsonify({"error": "User not found"}), 404

    # Check if request already exists
    existing_request = FriendRequest.query.filter_by(
        sender_id=sender_id,
        receiver_id=receiver_id,
        status='pending'
    ).first()
    if existing_request:
        return jsonify({"error": "Friend request already sent"}), 409

    # Create friend request
    friend_request = FriendRequest(
        sender_id=sender_id,
        receiver_id=receiver_id
    )
    db.session.add(friend_request)
    db.session.commit()

    return jsonify({"message": "Friend request sent successfully"}), 201

@app.route('/api/friend-request/<int:request_id>', methods=['PUT'])
def handle_friend_request(request_id):
    data = request.json
    if not data or not data.get('action') in ['accept', 'reject']:
        return jsonify({"error": "Valid action (accept/reject) is required"}), 400

    friend_request = FriendRequest.query.get(request_id)
    if not friend_request:
        return jsonify({"error": "Friend request not found"}), 404

    if friend_request.status != 'pending':
        return jsonify({"error": "Friend request already processed"}), 400

    if data['action'] == 'accept':
        # Add users as friends
        sender = User.query.get(friend_request.sender_id)
        receiver = User.query.get(friend_request.receiver_id)
        sender.friends.append(receiver)
        receiver.friends.append(sender)
        friend_request.status = 'accepted'
    else:
        friend_request.status = 'rejected'

    db.session.commit()
    return jsonify({"message": f"Friend request {data['action']}ed successfully"})

@app.route('/api/friends', methods=['GET'])
def get_friends():
    user_id = 1  # TODO: Replace with actual authenticated user ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    friends = user.friends.all()
    return jsonify({
        "friends": [{
            "id": friend.id,
            "username": friend.username,
            "profile_image": friend.profile_image
        } for friend in friends]
    })

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
    s
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

def init_test_data():
    # Check if we already have users
    if User.query.count() > 0:
        return

    # Create test users
    users = [
        {
            'username': 'Y2K_MusicLover',
            'password': 'test123',
            'display_name': 'Retro Beats',
            'bio': 'Music collector and Y2K enthusiast. Loving the digital aesthetic!',
            'profile_image': 'https://i.pinimg.com/736x/b9/5e/0f/b95e0f5e9c56a998d58e7d7d067c8764.jpg'
        },
        {
            'username': 'SynthWave_Queen',
            'password': 'test123',
            'display_name': 'Neon Dreams',
            'bio': 'Living in a synthwave paradise 🌴',
            'profile_image': 'https://i.pinimg.com/736x/8b/8b/1c/8b8b1c6b0f4c9e5c5b5e5c5b5e5c5b5e.jpg'
        },
        {
            'username': 'VaporWave_King',
            'password': 'test123',
            'display_name': 'Aesthetic Vibes',
            'bio': 'Vaporwave aesthetics and retro tunes 📼',
            'profile_image': 'https://i.pinimg.com/736x/7c/7c/7c/7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c.jpg'
        },
        {
            'username': 'CyberPunk_2025',
            'password': 'test123',
            'display_name': 'Digital Dreamer',
            'bio': 'Living in the future, one beat at a time 🌆',
            'profile_image': 'https://i.pinimg.com/736x/6d/6d/6d/6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d.jpg'
        }
    ]

    # Create users
    created_users = []
    for user_data in users:
        user = User()
        user.username = user_data['username']
        user.password_hash = generate_password_hash(user_data['password'])
        user.display_name = user_data['display_name']
        user.bio = user_data['bio']
        user.profile_image = user_data['profile_image']
        db.session.add(user)
        created_users.append(user)
    
    db.session.commit()

    # Make them friends with each other
    main_user = created_users[0]  # Y2K_MusicLover
    for other_user in created_users[1:]:
        main_user.friends.append(other_user)
    
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_test_data()
    app.run(debug=True)
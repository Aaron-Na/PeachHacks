# app.py - Main application file
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/profile_images'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB max upload size

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

    def __repr__(self):
        return f'<User {self.username}>'

# Create all tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

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

if __name__ == '__main__':
    app.run(debug=True)
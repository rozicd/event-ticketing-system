from flask import request, jsonify
from services.user_service import UserService
import uuid
from flask_jwt_extended import create_access_token


user_service = UserService()


def create_user():
    data = request.get_json()
    user = {
        "id": str(uuid.uuid4()),
        "name": data['name'],
        "surname": data['surname'],
        "password": data['password'],
        "email": data['email'],
        "role": "USER"
    }
    return jsonify({"message": "User created successfully"}), 201

def login_user():
    data = request.get_json()
    user = user_service.find_by_email_and_password(data['email'], data['password'])
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
    access_token = create_access_token(identity={'email': user['email'], 'role': user['role']})
    return jsonify(access_token=access_token), 200
    
    
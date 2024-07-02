from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity

MICROSERVICE_URL = 'http://localhost:5001/api'


def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'admin':
            return jsonify({"msg": "Admins only!"}), 403
        return fn(*args, **kwargs)
    return wrapper

def create_user():
    data = request.get_json()
    response = requests.post(f'{MICROSERVICE_URL}/users/register', json=data)
    return jsonify(response.json()), response.status_code

def login_user():
    data = request.get_json()
    response = requests.post(f'{MICROSERVICE_URL}/users/login', json=data)
    return jsonify(response.json()), response.status_code

@admin_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


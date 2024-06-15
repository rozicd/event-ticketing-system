from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity

MICROSERVICE_URL = 'http://localhost:8080/api'

@jwt_required()
def create_event():
    data = request.get_json()
    data['organizator_id'] = get_jwt_identity().get('id')
    response = requests.post(f'{MICROSERVICE_URL}/events', json=data)
    return jsonify(response.json()), response.status_code

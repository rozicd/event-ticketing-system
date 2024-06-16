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

@jwt_required()
def update_event(event_id):
    data = request.get_json()
    data['user_id'] = get_jwt_identity().get('id')
    response = requests.put(f'{MICROSERVICE_URL}/events/{event_id}', json=data)
    return jsonify(response.json()), response.status_code

def get_events():
    response = requests.get(f'{MICROSERVICE_URL}/events')
    return jsonify(response.json()), response.status_code
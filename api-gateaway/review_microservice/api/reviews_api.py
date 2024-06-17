from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity

MICROSERVICE_URL = 'http://localhost:8081/api'

@jwt_required()
def create_review():
    data = request.get_json()
    data['user_id'] = get_jwt_identity().get('id')
    response = requests.post(f'{MICROSERVICE_URL}/reviews', json=data)
    return jsonify(response.json()), response.status_code

def get_events_reviews(event_id):
    response = requests.get(f'{MICROSERVICE_URL}/reviews/{event_id}')
    return jsonify(response.json()), response.status_code
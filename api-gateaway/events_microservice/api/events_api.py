import datetime
from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
import json


MICROSERVICE_URL = 'http://localhost:8080/api'
UPLOAD_FOLDER = '././uploads'


@jwt_required()
def update_event(event_id):
    data = request.get_json()
    data['user_id'] = get_jwt_identity().get('id')
    response = requests.put(f'{MICROSERVICE_URL}/events/{event_id}', json=data)
    return jsonify(response.json()), response.status_code

def get_events():
    response = requests.get(f'{MICROSERVICE_URL}/events')
    return jsonify(response.json()), response.status_code


def get_event(event_id):
    response = requests.get(f'{MICROSERVICE_URL}/events/{event_id}')
    return jsonify(response.json()), response.status_code

@jwt_required()
def create_ticket():
    data = request.get_json()
    data['user_id'] = get_jwt_identity().get('id')
    response = requests.post(f'{MICROSERVICE_URL}/tickets', json=data)
    return jsonify(response.json()), response.status_code
@jwt_required()
def create_event():
    data = request.form.to_dict()
    file = request.files.get('image')
    path = ""
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        path = filename
    else:
        return jsonify({"error": "Image is required"}), 400
    
    event_data = {
        "name": data['name'],
        "begins": data['begins'],
        "event_type": data['event_type'],
        "capacity_rows": int(data['capacity_rows']),
        "capacity_columns": int(data['capacity_columns']),
        "capacity": int(data['capacity']),
        "location_longitude": float(data['location_longitude']),
        "location_latitude": float(data['location_latitude']),
        "location_address": data['location_address'],
        "organizator_id": get_jwt_identity().get('id'),
        "organizator_name": get_jwt_identity().get('name') + " " + get_jwt_identity().get('surname'),
        "image_path": path
    }
    response = requests.post(f'{MICROSERVICE_URL}/events', json=event_data)
    return jsonify(response.json()), response.status_code
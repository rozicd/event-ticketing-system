from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity


MICROSERVICE_URL = 'http://localhost:8084/api'


def get_analitics(interval):
    event_id = request.args.get('event_id')
    response = requests.get(f'{MICROSERVICE_URL}/tickets/{interval}?event_id={event_id}')
    return jsonify(response.json()), response.status_code
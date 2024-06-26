from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity

MICROSERVICE_URL = 'http://localhost:8082/api'

def fetch_events():
    page = request.args.get('page', 1)
    limit = request.args.get('limit', 5)
    
    response = requests.get(f'{MICROSERVICE_URL}/events', params={'page': page, 'limit': limit})

    return jsonify(response.json())

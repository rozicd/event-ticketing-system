from flask import Flask, request, jsonify
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity

MICROSERVICE_URL = 'http://localhost:8082/api'

def fetch_events():
    page = request.args.get('page', 1)
    limit = request.args.get('limit', 5)
    search = request.args.get('search_term', None)
    category = request.args.get('category', None)
    sort_order = request.args.get('sort_order', None)
    event_type = request.args.get('event_type', None)
    
    
    response = requests.get(f'{MICROSERVICE_URL}/events', params={'page': page, 'limit': limit, 'search_term': search, 'category': category, 'sort_order': sort_order, 'event_type': event_type})

    return jsonify(response.json())

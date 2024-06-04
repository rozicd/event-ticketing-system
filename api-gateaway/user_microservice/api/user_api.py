from flask import Flask, request, jsonify
import requests

MICROSERVICE_URL = 'http://localhost:5001/api'


def create_user():
    data = request.get_json()
    response = requests.post(f'{MICROSERVICE_URL}/users/register', json=data)
    return jsonify(response.json()), response.status_code
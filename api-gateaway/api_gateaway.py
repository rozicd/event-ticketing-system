from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

MICROSERVICE_URL = 'http://localhost:5001'

@app.route('/gateway/users', methods=['POST'])
def create_user():
    data = request.get_json()
    response = requests.post(f'{MICROSERVICE_URL}/users', json=data)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(port=5000, debug=True)

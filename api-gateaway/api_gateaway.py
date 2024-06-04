from flask import Flask, request, jsonify
import requests
from user_microservice.routes.user_api_bp import user_api_bp

app = Flask(__name__)
app.register_blueprint(user_api_bp, url_prefix='/gateway/users')

if __name__ == '__main__':
    app.run(port=5000, debug=True)

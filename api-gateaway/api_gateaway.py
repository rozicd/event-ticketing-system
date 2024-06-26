from flask import Flask, jsonify
from user_microservice.routes.user_api_bp import user_api_bp
from events_microservice.routes.events_api_bp import events_api_bp
from review_microservice.routes.reviews_api_bp import *
from search_microservice.routes.search_api_bp import *
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS


app = Flask(__name__)

CORS(app, resources={
    r"/gateway/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"],
        "supports_credentials": True
    }
})

app.register_blueprint(user_api_bp, url_prefix='/gateway/users')
app.register_blueprint(events_api_bp, url_prefix='/gateway/events')
app.register_blueprint(reviews_api_bp, url_prefix='/gateway/reviews')
app.register_blueprint(search_api_bp, url_prefix='/gateway/search')
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Must be the same secret key as in user microservice
jwt = JWTManager(app)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

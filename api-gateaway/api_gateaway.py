from flask import Flask, jsonify
from user_microservice.routes.user_api_bp import user_api_bp
from events_microservice.routes.events_api_bp import events_api_bp
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
app.register_blueprint(user_api_bp, url_prefix='/gateway/users')
app.register_blueprint(events_api_bp, url_prefix='/gateway/events')
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Must be the same secret key as in user microservice
jwt = JWTManager(app)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

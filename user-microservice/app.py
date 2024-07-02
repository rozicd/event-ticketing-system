from flask import Flask, request, jsonify
from routes.user_bp import user_bp
from flask_jwt_extended import JWTManager


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to your secret key
jwt = JWTManager(app)

# In-memory "database" for demonstration purposes
users = []

app.register_blueprint(user_bp, url_prefix='/api/users')


if __name__ == '__main__':
    app.run(port=5001, debug=True)

from flask import Flask, request, jsonify
from routes.user_bp import user_bp

app = Flask(__name__)

# In-memory "database" for demonstration purposes
users = []

app.register_blueprint(user_bp, url_prefix='/api/users')


if __name__ == '__main__':
    app.run(port=5001, debug=True)

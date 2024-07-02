from flask import Blueprint
from user_microservice.api.user_api import *


user_api_bp = Blueprint('user_api_bp', __name__)

user_api_bp.route('/register', methods=['POST'])(create_user)
user_api_bp.route('/login', methods=['POST'])(login_user)
user_api_bp.route('/protected', methods=['GET'])(protected)
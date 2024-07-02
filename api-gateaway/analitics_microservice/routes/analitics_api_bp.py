from flask import Blueprint
from analitics_microservice.api.analitics_api import *


analitics_api_bp = Blueprint('analitics_api_bp', __name__)

analitics_api_bp.route('/tickets/<interval>', methods=['GET'])(get_analitics)
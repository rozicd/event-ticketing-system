from flask import Blueprint
from search_microservice.api.search_api import *


search_api_bp = Blueprint('search_api_bp', __name__)


search_api_bp.route('/', methods=['GET'])(fetch_events)
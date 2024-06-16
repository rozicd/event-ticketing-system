from flask import Blueprint
from events_microservice.api.events_api import *


events_api_bp = Blueprint('events_api_bp', __name__)

events_api_bp.route('/create-event', methods=['POST'])(create_event)
events_api_bp.route('/update-event/<event_id>', methods=['PUT'])(update_event)
events_api_bp.route('/', methods=['GET'])(get_events)
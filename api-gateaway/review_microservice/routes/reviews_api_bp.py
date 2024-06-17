from flask import Blueprint
from review_microservice.api.reviews_api import *

reviews_api_bp = Blueprint('reviews_api_bp', __name__)

reviews_api_bp.route('/create-review', methods=['POST'])(create_review)
reviews_api_bp.route('/get-events-review/<event_id>', methods=['GET'])(get_events_reviews)

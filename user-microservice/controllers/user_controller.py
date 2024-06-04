from flask import request, jsonify

users = []
def create_user():
    data = request.get_json()
    user = {
        "id": len(users) + 1,
        "name": data['name'],
        "email": data['email']
    }
    users.append(user)
    return jsonify(user), 201
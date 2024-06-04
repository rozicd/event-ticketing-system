from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory "database" for demonstration purposes
users = []

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = {
        "id": len(users) + 1,
        "name": data['name'],
        "email": data['email']
    }
    users.append(user)
    return jsonify(user), 201

if __name__ == '__main__':
    app.run(port=5001, debug=True)

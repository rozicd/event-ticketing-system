from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)
UPLOAD_FOLDER = '../api-gateaway/uploads'
@app.route('/gateway/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5005, debug=True)
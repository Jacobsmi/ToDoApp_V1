# pip install flask
from flask import Flask, jsonify, request
# pip install flask-cors
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/createtask', methods=["POST"])
def createtask():
    if request.method == "POST":
        print("RECEIVED POST REQUEST")
        print(request.form)
        return 'test'
    return "Unsuccessful"

if __name__ == "__main__":
    app.run(debug=True)
# pip install flask
from flask import Flask, jsonify, request
# pip install flask-cors
from flask_cors import CORS

from database_controller import Database
# Create an instance of the API
API = Flask(__name__)

cors = CORS(API, resources={r"*": {"origins": "*"}})

task_db = Database('task.db')

@API.route('/createtask', methods=["POST"])
def createtask():
    if request.method == "POST":
        print("RECEIVED POST REQUEST")
        task_name = request.json['name']
        db_insert = task_db.insert_new_task([task_name])
        if db_insert == 1:
            return 'Success'
    return "Unsuccessful"

if __name__ == "__main__":
    API.run(debug=True)
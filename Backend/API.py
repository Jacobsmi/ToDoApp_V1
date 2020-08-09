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
        try:
            task_name = request.json['name']
            task_due = request.json['due']
            task_db.insert_new_task([task_name, task_due])
            return jsonify(success = 'success')
        except:
            return jsonify(error = 'db_error')
    return jsonify(error='db_error')

# Retrieves all tasks from the database
@API.route('/alltasks', methods=["GET"])
def get_all_tasks():
    try:
        # Gets all tasks from the database controller
        result = task_db.get_all_tasks()
        # Returns them as JSON
        return jsonify(result)
    except:
        return jsonify(error = 'db_error')

@API.route('/deleteTask' , methods=['DELETE'])
def deleteTask():
    try:
        task_db.delete_task(request.json['id'])
        return jsonify(success = 'success')
    except:
        return jsonify(error='db_error')

@API.route('/completetask' , methods=['PUT'])
def completeTask():
    if request.method == "PUT":
        try:
            rowid = int(request.json['id'])
            completed = int(request.json['completed'])
            task_db.update_completed([completed, rowid])
            return jsonify(success = 'success')
        except:
            return jsonify(error='db_error')
    return jsonify(error='db_error')

if __name__ == "__main__":
    API.run(debug=True)

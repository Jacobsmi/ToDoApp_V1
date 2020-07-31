from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/createtask', methods=["POST"])
def createtask():
    if request.method == "POST":
        print("RECEIVED POST REQUEST")
        print(request.form)
        return jsonify({'name': request.form['name']})
    return "Unsuccessful"

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

app = Flask(__name__)
CORS(app)

sys.path.append(os.path.abspath("../src/services"))
from db_service import DBService

sys.path.append(os.path.abspath("../src/utils"))
from payload_verification import payload_verification

'''
Connects to the database. 
'''


@app.route('/connect', methods=['POST'])
def connect_database():
    db_service = DBService()
    """
    Endpoint to connect to the database
    Returns JSON response with connection status
    """
    return db_service.connect_to_db()

@app.route('/disconnect', methods=['POST'])
def disconnect_database():
    db_service = DBService()
    return db_service.disconnect_from_db()


'''
Inserts a new value into a specific table within the CS4604 database. 
'''
@app.route("/insert/<table_name>", methods=["POST"])
def insert_new_value(table_name: str):
    db_service = DBService()
    payload = dict(request.json)
    valid_payload = payload_verification(table_name, payload)
    if not valid_payload:
        return jsonify(
            {
                "error_message": f"Invalid payload for table: {table_name}, requested payload: {payload}"
            }
        ), 400
    return db_service.insert_into_db(table_name, payload)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

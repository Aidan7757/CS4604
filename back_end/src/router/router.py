from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import mysql

app = Flask(__name__)
CORS(app)

sys.path.append(os.path.abspath("../src/services"))
from db_service import DBService

sys.path.append(os.path.abspath("../src/utils"))
from payload_verification import payload_verification

TABLE_METADATA = {
    "alert": {"pk": "alert_id", "plural": "alerts"},
    "organization": {"pk": "org_id", "plural": "organizations"},
    "park": {"pk": "park_id", "plural": "parks"},
    "visitor": {"pk": "visitor_id", "plural": "visitors"},
    "pollutant": {"pk": "pollutant_id", "plural": "pollutants"},
    "species": {"pk": "species_id", "plural": "species"},
    "preservation_project": {"pk": "project_id", "plural": "projects"},
}

VALID_TABLES = set(TABLE_METADATA.keys())


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

    if table_name.lower() not in VALID_TABLES:
        return jsonify(
            {
                "error_message": f"Table {table_name} is not a valid table",
            }
        ), 400
    db_service = DBService()
    payload = dict(request.json)
    valid_payload = payload_verification(table_name, payload)
    if not valid_payload:
        return jsonify(
            {
                "error_message": f"Invalid payload for table: {table_name}",
                "payload": payload
            }
        ), 400
    try:
        return db_service.insert_into_db(table_name, payload)
    except mysql.connector.errors.IntegrityError:
        return jsonify(
            {
                "error_message": f"Duplicate entry for insertion attempt into {table_name}.",
                "payload": payload
            }
        ), 400

'''
Deletes a value from a specific table within the CS4604 database. 
'''
@app.route("/delete/<table_name>", methods=["POST"])
def delete_value(table_name: str):
    if table_name.lower() not in VALID_TABLES:
        return jsonify(
            {
                "error_message": f"Table {table_name} is not a valid table",
            }
        ), 400
    db_service = DBService()
    if request.json:
        payload = dict(request.json)
    else:
        payload = {}
    try:
        return db_service.delete_from_db(table_name, payload)
    except Exception as e:
        return jsonify(
            {
                "error_message": f"Delete failed: {str(e)}"
            }
        ), 400

'''
Selects rows from a specific table within the CS4604 database. 
'''
@app.route("/select/<table_name>", methods=["GET"])
def select_table(table_name: str):
    if table_name.lower() not in VALID_TABLES:
        return jsonify({
            "error_message": f"Table {table_name} is not a valid table"
        }), 400

    db_service = DBService()
    return db_service.select_rows(table_name)

@app.route("/<plural_table_name>/<id_value>", methods=["GET", "PUT", "DELETE"])
def handle_record(plural_table_name, id_value):
    table_name = None
    for name, meta in TABLE_METADATA.items():
        if meta["plural"] == plural_table_name.lower():
            table_name = name
            break

    if not table_name:
        return jsonify({"error_message": f"Table {plural_table_name} is not a valid table"}), 400

    pk_column = TABLE_METADATA[table_name]["pk"]
    db_service = DBService()

    if request.method == "GET":
        return db_service.get_by_id(table_name, pk_column, id_value)
    elif request.method == "PUT":
        payload = dict(request.json)
        return db_service.update_by_id(table_name, pk_column, id_value, payload)
    elif request.method == "DELETE":
        return db_service.delete_by_id(table_name, pk_column, id_value)

"""
Get all alerts
"""
@app.route('/alerts', methods=['GET'])
def get_alerts():
    db_service = DBService()
    return db_service.get_all_alerts()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

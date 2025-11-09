from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import mysql

app = Flask(__name__)
CORS(app)

sys.path.append(os.path.abspath("../src/services"))
from db_service import DBService
from simple_auth_service import AuthService

sys.path.append(os.path.abspath("../src/utils"))
from payload_verification import payload_verification

VALID_TABLES = {"alert",
                "organization",
                "park",
                "visitor",
                "pollutant",
                "species",
                "preservation_project"}


# ========== Login Endpoint ==========

@app.route('/login', methods=['POST'])
def login():
    """
    Login endpoint - user sends email and password, gets token back.
    
    Request body:
        {
            "email": "user@example.com",
            "password": "password123"
        }
    
    Response:
        {
            "status": "success",
            "token": "eyJhbGc..."
        }
    """
    data = request.json
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Email and password are required'
        }), 400
    
    email = data['email']
    password = data['password']
    
    # Verify credentials
    if not AuthService.verify_credentials(email, password):
        return jsonify({
            'status': 'error',
            'message': 'Invalid email or password'
        }), 401
    
    # Generate token
    token = AuthService.generate_token(email)
    
    return jsonify({
        'status': 'success',
        'token': token
    }), 200


# ========== Protected Endpoints (All require token) ==========

@app.route('/connect', methods=['POST'])
@AuthService.require_auth()
def connect_database():
    """
    Connect to the database.
    Requires valid token in Authorization header.
    """
    db_service = DBService()
    return db_service.connect_to_db()


@app.route('/disconnect', methods=['POST'])
@AuthService.require_auth()
def disconnect_database():
    """
    Disconnect from the database.
    Requires valid token in Authorization header.
    """
    db_service = DBService()
    return db_service.disconnect_from_db()


@app.route("/insert/<table_name>", methods=["POST"])
@AuthService.require_auth()
def insert_new_value(table_name: str):
    """
    Insert a new value into a specific table.
    Requires valid token in Authorization header.
    """
    if table_name.lower() not in VALID_TABLES:
        return jsonify({
            "error_message": f"Table {table_name} is not a valid table",
        }), 400
    
    db_service = DBService()
    payload = dict(request.json)
    valid_payload = payload_verification(table_name, payload)
    
    if not valid_payload:
        return jsonify({
            "error_message": f"Invalid payload for table: {table_name}",
            "payload": payload
        }), 400
    
    try:
        return db_service.insert_into_db(table_name, payload)
    except mysql.connector.errors.IntegrityError:
        return jsonify({
            "error_message": f"Duplicate entry for insertion attempt into {table_name}.",
            "payload": payload
        }), 400


@app.route("/delete/<table_name>", methods=["POST"])
@AuthService.require_auth()
def delete_value(table_name: str):
    """
    Delete a value from a specific table.
    Requires valid token in Authorization header.
    """
    if table_name.lower() not in VALID_TABLES:
        return jsonify({
            "error_message": f"Table {table_name} is not a valid table",
        }), 400
    
    db_service = DBService()
    
    if request.json:
        payload = dict(request.json)
    else:
        payload = {}
    
    try:
        return db_service.delete_from_db(table_name, payload)
    except Exception as e:
        return jsonify({
            "error_message": f"Delete failed: {str(e)}"
        }), 400


@app.route("/select/<table_name>", methods=["GET"])
@AuthService.require_auth()
def select_table(table_name: str):
    """
    Select rows from a specific table.
    Requires valid token in Authorization header.
    """
    if table_name.lower() not in VALID_TABLES:
        return jsonify({
            "error_message": f"Table {table_name} is not a valid table"
        }), 400

    db_service = DBService()
    return db_service.select_rows(table_name)


# ========== Public Endpoint (No auth required) ==========

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint - no authentication required.
    """
    return jsonify({
        'status': 'healthy',
        'message': 'API is running'
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
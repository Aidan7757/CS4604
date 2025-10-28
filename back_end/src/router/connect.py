from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import sys 

app = Flask(__name__)
CORS(app) 

sys.path.append(os.path.abspath("../src/services"))
from db import connect_to_db

@app.route('/connect', methods=['GET'])
def connect_database():
    """
    Endpoint to connect to the database
    Returns JSON response with connection status
    """
    return connect_to_db()
'''
Inserts a new value into a specific table within the CS4604 database. 
'''
@app.route("/insert/<table_name>", methods=["POST"])
def insert_new_value(table_name: str):
    payload = dict(request.json)
    
    return jsonify({"status": "test"})
            


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
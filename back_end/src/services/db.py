from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import sys

sys.path.append(os.path.abspath("../src/utils"))
from config import DB_CONFIG

def connect_to_db():
    try:
        # Attempt to connect to the database
        cnx = mysql.connector.connect(**DB_CONFIG)
        
        if cnx.is_connected():
            db_info = cnx.get_server_info()
            cursor = cnx.cursor()
            cursor.execute("SELECT DATABASE();")
            database_name = cursor.fetchone()[0]
            cursor.close()
            cnx.close()
            
            return jsonify({
                'status': 'success',
                'message': 'Database connection successful',
                'database': database_name,
                'server_version': db_info
            }), 200
            
    except Error as e:
        return jsonify({
            'status': 'error',
            'message': 'Database connection failed',
            'error': str(e)
        }), 500
    
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cnx.close()

def insert_into_db():
    pass
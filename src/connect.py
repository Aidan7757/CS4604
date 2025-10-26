from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app) 

# Database configuration
DB_CONFIG = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'database': os.getenv('DB_NAME', 'CS4604')
}

@app.route('/connect', methods=['GET'])
def connect_database():
    """
    Endpoint to test database connection
    Returns JSON response with connection status
    """
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
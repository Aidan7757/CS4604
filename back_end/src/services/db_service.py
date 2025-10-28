from flask import jsonify
import mysql.connector
from mysql.connector import Error
import os
import sys

sys.path.append(os.path.abspath("../src/utils"))
from config import DB_CONFIG


class DBService:

    def __init__(self):
        self.cursor = None
        self.db = None

    def connect_to_db(self):
        try:
            self.db = mysql.connector.connect(**DB_CONFIG)

            if self.db.is_connected():
                db_info = self.db.get_server_info()
                self.cursor = self.db.cursor()
                self.cursor.execute("SELECT DATABASE();")
                database_name = self.cursor.fetchone()[0]

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


    def disconnect_from_db(self):
        if self.cursor:
            self.cursor.close()
        if self.db and self.db.is_connected():
            self.db.close()

    def insert_into_db(self, table_name: str, payload: dict):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.db.cursor()

        columns = ', '.join(payload.keys())
        placeholders = ', '.join(['%s'] * len(payload))
        insertion_command = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

        self.cursor.execute(insertion_command, tuple(payload.values()))
        self.db.commit()

        return insertion_command
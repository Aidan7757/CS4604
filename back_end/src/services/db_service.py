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

        return jsonify({
            "message": "Disconnected from database."
        }), 200

    def insert_into_db(self, table_name: str, payload: dict):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.db.cursor()

        columns = ', '.join(payload.keys())
        placeholders = ', '.join(['%s'] * len(payload))
        insertion_command = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

        self.cursor.execute(insertion_command, tuple(payload.values()))
        self.db.commit()

        return jsonify({
            "message": f"Successfully inserted into table: {table_name} with value(s) {tuple(payload.values())}"
        }), 200

    def delete_from_db(self, table_name: str, payload: dict):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.db.cursor()

        if not payload:
            return jsonify({
                "error_message": "Delete requires at least one item (key, value) to remove"
            }), 400
        
        conditions_list = [f"{col} = %s" for col in payload.keys()]
        conditions_in_sql = " AND ".join(conditions_list)
        deletion_command = f"DELETE FROM {table_name} WHERE {conditions_in_sql}"

        self.cursor.execute(deletion_command, tuple(payload.values()))
        self.db.commit()

        if self.cursor.rowcount == 0:
            return jsonify({
                "error_message": f"Deletion failed as no rows matched in {table_name}",
                "rows_affected": 0
            }), 404
        
        return jsonify({
            "message": f"Successfully deleted {tuple(payload.values())} value(s) from table: {table_name}",
            "rows_affected": self.cursor.rowcount
        }), 200

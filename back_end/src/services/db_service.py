from flask import jsonify
import mysql.connector
from mysql.connector import Error
import os
import sys

sys.path.append(os.path.abspath("../utils"))
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
            "message": f"Successfully deleted {self.cursor.rowcount} row(s) from table: {table_name}",
            "rows_affected": self.cursor.rowcount
        }), 200
    
    def select_rows(self, table_name: str):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor(dictionary=True)

        sql = f"SELECT * FROM {table_name}"

        try:
            self.cursor.execute(sql)
            rows = self.cursor.fetchall() 
            return jsonify(rows), 200
        except mysql.connector.Error as e:
            return jsonify({
                "error_message": f"Select failed: {str(e)}"
            }), 400

    def get_by_id(self, table_name, pk_column, id_value):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor(dictionary=True)
        try:
            self.cursor.execute(f"SELECT * FROM {table_name} WHERE {pk_column} = %s", (id_value,))
            result = self.cursor.fetchone()
            if result:
                return jsonify(result), 200
            else:
                return jsonify({"message": f"Record with ID {id_value} not found in {table_name}"}), 404
        except Error as e:
            return jsonify({"error": str(e)}), 500

    def update_by_id(self, table_name, pk_column, id_value, payload):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor()
        try:
            update_query = f"UPDATE {table_name} SET {{}} WHERE {pk_column} = %s".format(
                ', '.join([f'{k}=%s' for k in payload.keys()])
            )
            values = list(payload.values()) + [id_value]
            self.cursor.execute(update_query, values)
            self.db.commit()
            return jsonify({"message": f"Record with ID {id_value} in {table_name} updated successfully."}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500

    def delete_by_id(self, table_name, pk_column, id_value):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor()
        try:
            self.cursor.execute(f"DELETE FROM {table_name} WHERE {pk_column} = %s", (id_value,))
            self.db.commit()
            if self.cursor.rowcount == 0:
                return jsonify({"message": f"Record with ID {id_value} not found in {table_name}"}), 404
            return jsonify({"message": f"Record with ID {id_value} from {table_name} deleted successfully."}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500

    def get_all_alerts(self):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor(dictionary=True)
        try:
            self.cursor.execute("""
                SELECT a.*, p.park_name
                FROM alert a
                JOIN park p ON a.park_id = p.park_id
            """)
            result = self.cursor.fetchall()
            return jsonify(result), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500

    def get_statistics(self):
        if not self.db or not self.db.is_connected():
            self.db = mysql.connector.connect(**DB_CONFIG)
        
        self.cursor = self.db.cursor(dictionary=True)
        try:
            self.cursor.execute("""
                SELECT 
                    COUNT(*) AS total_visitors,
                    MIN(age) AS min_age,
                    MAX(age) AS max_age,
                    AVG(age) AS avg_age,
                    SUM(
                        CASE
                            WHEN hour_left IS NOT NULL AND hour_entered IS NOT NULL
                            THEN TIMESTAMPDIFF(HOUR, hour_entered, hour_left)
                            ELSE 0
                        END
                ) AS total_visitor_hours_spent,
                    AVG(
                        CASE
                            WHEN hour_left IS NOT NULL AND hour_entered IS NOT NULL
                            THEN TIMESTAMPDIFF(HOUR, hour_entered, hour_left)
                            ELSE 0
                        END
                    ) AS avg_hours_per_visitor
                FROM visitor
            """)
            visitor_overview = self.cursor.fetchone()

            self.cursor.execute("""
                SELECT
                    COUNT(DISTINCT p.park_id) AS total_parks,
                    COUNT(DISTINCT pol.park_id) AS parks_with_pollutants,
                    ROUND(
                        CASE
                            WHEN COUNT(DISTINCT p.park_id) = 0 
                                THEN 0
                            ELSE COUNT(DISTINCT pol.park_id) * 100.0 / COUNT(DISTINCT p.park_id) 
                        END, 1) AS percent_parks_affected
                FROM park p
                LEFT JOIN pollutant pol 
                    ON p.park_id = pol.park_id                             
            """)
            pollutant_overview = self.cursor.fetchone()

            self.cursor.execute("""
                SELECT 
                    conservation_status,
                    COUNT(*) AS num_species,
                    SUM(species_count) AS species_total,   
                    AVG(species_count) AS avg_species_count,
                    MIN(species_count) AS min_species_count,
                    MAX(species_count) AS max_species_count
                FROM species    
                GROUP BY conservation_status
                ORDER BY conservation_status;
                """)
            species_overview = self.cursor.fetchall()
            
            self.cursor.execute("""
                SELECT
                    p.park_id,
                    p.park_name,
                    COUNT(a.alert_id) AS alert_count
                FROM park p
                LEFT JOIN alert a ON p.park_id = a.park_id
                GROUP BY p.park_id, p.park_name
                ORDER BY alert_count DESC, p.park_name;
            """)
            alert_overview = self.cursor.fetchall()

            self.cursor.execute("""
                SELECT
                    s.conservation_status,
                    COUNT(DISTINCT s.species_id) AS species_addressed,
                    COUNT(DISTINCT pp.project_id) AS projects_count
                FROM preservation_project pp
                JOIN species s ON pp.species_id = s.species_id
                GROUP BY s.conservation_status
                ORDER BY s.conservation_status;
            """)
            preservation_project_overview = self.cursor.fetchall()
            
            result = {
                "visitor_overview": visitor_overview,
                "pollutant_overview": pollutant_overview,
                "species_overview": species_overview,
                "alert_overview": alert_overview,
                "preservation_project_overview": preservation_project_overview
            }
            return jsonify(result), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
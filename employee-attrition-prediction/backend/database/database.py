import sqlite3
import os
import uuid
from datetime import datetime

# Local SQLite database path
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'attrition.db')

def get_db_connection():
    # To migrate to Postgres, swap this with psycopg2 or SQLAlchemy connection pool
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Create predictions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            employee_reference TEXT,
            prediction TEXT,
            probability REAL,
            risk_level TEXT,
            created_at TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_prediction(employee_ref, prediction, probability, risk_level):
    conn = get_db_connection()
    cursor = conn.cursor()
    pred_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    
    cursor.execute('''
        INSERT INTO predictions (id, employee_reference, prediction, probability, risk_level, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (pred_id, employee_ref, prediction, probability, risk_level, created_at))
    
    conn.commit()
    conn.close()
    return pred_id

def get_prediction_history(limit=50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, employee_reference, prediction, probability, risk_level, created_at 
        FROM predictions 
        ORDER BY created_at DESC 
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

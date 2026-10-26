import os

BASE_DIR = os.path.dirname(__file__)

class Config:
    # Use SQLite by default, easy to override with DATABASE_URL for Postgres in production
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///attrition.db')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    CORS_ORIGINS = os.getenv('FRONTEND_URL', '*')
    
    # Risk thresholds
    RISK_THRESHOLD_LOW = 0.40
    RISK_THRESHOLD_HIGH = 0.70

    # Path to the master employee CSV
    CSV_PATH = os.path.abspath(os.path.join(BASE_DIR, 'database', 'employee_attrition_single_company.csv'))

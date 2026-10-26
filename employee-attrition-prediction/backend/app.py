import sys
import os

# Add the project root to sys.path so we can import backend as a module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.services.model_service import model_service
from backend.routes.health_routes import health_bp
from backend.routes.prediction_routes import prediction_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # Load ML Model
    try:
        model_service.load_artifacts()
    except Exception as e:
        print(f"Warning: Could not load ML artifacts on startup: {e}")

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(prediction_bp)

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(app.config['FLASK_ENV'] == 'development'))

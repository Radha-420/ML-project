from flask import Blueprint, jsonify
from backend.services.model_service import model_service

health_bp = Blueprint('health_bp', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    status = "healthy" if model_service.model is not None else "degraded"
    return jsonify({
        "status": status,
        "model_loaded": model_service.model is not None
    }), 200

@health_bp.route('/api/model-info', methods=['GET'])
def model_info():
    metadata = model_service.get_metadata()
    if metadata:
        return jsonify({
            "success": True,
            "data": metadata
        }), 200
    return jsonify({
        "success": False,
        "error": "Model metadata not available"
    }), 404

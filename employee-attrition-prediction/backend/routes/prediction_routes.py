from flask import Blueprint, request, jsonify
from backend.services.prediction_service import PredictionService
from backend.history_service import save_prediction, get_prediction_history, get_statistics
import traceback

prediction_bp = Blueprint('prediction_bp', __name__)

@prediction_bp.route('/api/predict-new', methods=['POST'])
def predict_new():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400

        result = PredictionService.predict(data)
        
        # Check if the frontend provided an explicit employee reference
        emp_ref = data.get('EmployeeCode') or data.get('EmployeeID')
        if not emp_ref:
            import uuid
            emp_ref = f"NEW-{str(uuid.uuid4())[:6].upper()}"
        
        pred_id = save_prediction(
            employee_ref=emp_ref,
            prediction=result["prediction"],
            probability=result["probability"],
            risk_level=result["risk_level"]
        )

        return jsonify({
            "success": True,
            "prediction_id": pred_id,
            "prediction": result["prediction"],
            "probability": result["probability"],
            "risk_level": result["risk_level"]
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error during prediction."}), 500

@prediction_bp.route('/api/predict/<string:emp_id>', methods=['POST'])
def predict_existing(emp_id):
    try:
        from backend.employee_service import get_employee_by_id
        employee_data = get_employee_by_id(emp_id)
        
        if not employee_data:
            return jsonify({"success": False, "error": "Employee not found in master dataset"}), 404
            
        result = PredictionService.predict(employee_data)
        
        pred_id = save_prediction(
            employee_ref=emp_id,
            prediction=result["prediction"],
            probability=result["probability"],
            risk_level=result["risk_level"]
        )

        return jsonify({
            "success": True,
            "prediction_id": pred_id,
            "prediction": result["prediction"],
            "probability": result["probability"],
            "risk_level": result["risk_level"]
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error during prediction."}), 500

@prediction_bp.route('/api/history', methods=['GET'])
def history():
    try:
        limit = request.args.get('limit', default=50, type=int)
        records = get_prediction_history(limit)
        
        # Try to dynamically replace legacy integer IDs with EmployeeCodes
        from backend.employee_service import get_employee_by_id
        for r in records:
            ref = r.get('employee_reference') or r.get('employee_ref')
            if ref and ref.isdigit():
                emp = get_employee_by_id(ref)
                if emp and 'EmployeeCode' in emp:
                    # Update both just in case
                    if 'employee_reference' in r:
                        r['employee_reference'] = emp['EmployeeCode']
                    if 'employee_ref' in r:
                        r['employee_ref'] = emp['EmployeeCode']
                    
        return jsonify({"success": True, "data": records}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error fetching history."}), 500

@prediction_bp.route('/api/statistics', methods=['GET'])
def statistics():
    try:
        stats = get_statistics()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error fetching statistics."}), 500

@prediction_bp.route('/api/history/<string:pred_id>', methods=['DELETE'])
def delete_history(pred_id):
    try:
        # Import dynamically or use the existing import
        from backend.history_service import delete_prediction
        success = delete_prediction(pred_id)
        if success:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Record not found"}), 404
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error deleting history."}), 500

@prediction_bp.route('/api/dataset/schema', methods=['GET'])
def get_schema():
    try:
        import pandas as pd
        import os
        from backend.dataset_service import CSV_PATH
        
        if not os.path.exists(CSV_PATH):
            return jsonify({"success": False, "error": "Dataset not found"}), 404
            
        df = pd.read_csv(CSV_PATH)
        drop_cols = ['EmployeeCode', 'EmployeeID', 'EmployeeName', 'Attrition', 'EmpID', 'empid']
        features = [c for c in df.columns if c not in drop_cols]
        
        schema = []
        for col in features:
            if pd.api.types.is_numeric_dtype(df[col]):
                schema.append({
                    "name": col,
                    "type": "numerical",
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "mean": float(df[col].mean())
                })
            else:
                schema.append({
                    "name": col,
                    "type": "categorical",
                    "options": df[col].dropna().unique().tolist()
                })
                
        return jsonify({"success": True, "data": schema}), 200
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/employees', methods=['GET'])
def get_employees():
    try:
        from backend.employee_service import get_all_employees
        employees = get_all_employees()
        return jsonify({"success": True, "data": employees}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/employees/<string:emp_id>', methods=['GET'])
def get_employee(emp_id):
    try:
        from backend.employee_service import get_employee_by_id
        employee = get_employee_by_id(emp_id)
        if employee:
            return jsonify({"success": True, "data": employee}), 200
        return jsonify({"success": False, "error": "Not found"}), 404
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        from backend.analytics_service import get_analytics_data
        data = get_analytics_data()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/company', methods=['GET'])
def get_company():
    try:
        from backend.dataset_service import get_dataset_info
        data = get_dataset_info()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/dataset/upload', methods=['POST'])
def upload_dataset():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "error": "No selected file"}), 400
        
        if file and file.filename.endswith('.csv'):
            from backend.dataset_service import save_new_dataset
            save_new_dataset(file)
            return jsonify({"success": True, "message": "File uploaded successfully"}), 200
        else:
            return jsonify({"success": False, "error": "Only CSV files are allowed"}), 400
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@prediction_bp.route('/api/dataset/retrain', methods=['POST'])
def trigger_retrain():
    try:
        from backend.dataset_service import retrain_model
        result = retrain_model()
        
        if result["success"]:
            # Need to reload the model in memory!
            from backend.services.model_service import model_service
            model_service.load_artifacts()
            return jsonify({"success": True, "message": "Model retrained successfully", "output": result["output"]}), 200
        return jsonify({"success": False, "error": result["error"]}), 500
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

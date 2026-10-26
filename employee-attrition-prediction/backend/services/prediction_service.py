import pandas as pd
from backend.services.model_service import model_service
from backend.config import Config

class PredictionService:
    @staticmethod
    def calculate_risk_level(probability):
        if probability < Config.RISK_THRESHOLD_LOW:
            return "Low"
        elif probability < Config.RISK_THRESHOLD_HIGH:
            return "Medium"
        else:
            return "High"

    @staticmethod
    def predict(employee_data):
        # 1. Convert JSON to DataFrame
        df = pd.DataFrame([employee_data])
        
        # 2. Clean up extra columns not in the model
        drop_cols = ['EmployeeCode', 'EmployeeID', 'EmployeeName', 'Attrition', 'EmpID', 'empid']
        for col in drop_cols:
            if col in df.columns:
                df = df.drop(columns=[col])

        # 3. Preprocess Data
        try:
            X_processed = model_service.preprocessor.transform(df)
        except Exception as e:
            raise ValueError(f"Preprocessing failed. Check if all required features are provided. Error: {e}")

        # 4. Predict
        try:
            prediction = model_service.model.predict(X_processed)[0]
            probability = 0.0
            if hasattr(model_service.model, "predict_proba"):
                probability = model_service.model.predict_proba(X_processed)[0][1]
            else:
                # Fallback if model doesn't support proba
                probability = float(prediction)
        except Exception as e:
            raise RuntimeError(f"Model inference failed: {e}")

        # 5. Calculate Risk
        risk_level = PredictionService.calculate_risk_level(probability)
        prediction_label = "Yes" if prediction == 1 else "No"

        return {
            "prediction": prediction_label,
            "probability": round(float(probability), 4),
            "risk_level": risk_level
        }

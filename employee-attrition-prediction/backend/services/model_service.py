import os
import joblib
import json

class ModelService:
    def __init__(self):
        self.base_dir = os.path.dirname(__file__)
        self.models_dir = os.path.join(self.base_dir, '..', '..', 'ml', 'models')
        self.model = None
        self.preprocessor = None
        self.metadata = None

    def load_artifacts(self):
        try:
            model_path = os.path.join(self.models_dir, 'best_model.pkl')
            preprocessor_path = os.path.join(self.models_dir, 'preprocessing_pipeline.pkl')
            metadata_path = os.path.join(self.models_dir, 'model_metadata.json')

            if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
                raise FileNotFoundError("Model artifacts not found. Please train models first.")

            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(preprocessor_path)

            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
            
            print(f"Successfully loaded model and preprocessor.")
        except Exception as e:
            print(f"Error loading artifacts: {e}")
            raise e

    def get_metadata(self):
        return self.metadata

model_service = ModelService()

import os
import subprocess
import json

from backend.config import Config

BASE_DIR = os.path.dirname(__file__)
ML_SRC_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'ml', 'src'))
CSV_PATH = Config.CSV_PATH
META_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'company_metadata.json'))

def save_new_dataset(file_obj):
    file_obj.save(CSV_PATH)
    return True
    
def retrain_model():
    # Call the train.py script
    train_script = os.path.join(ML_SRC_DIR, 'train.py')
    
    try:
        # We run it as a subprocess so it doesn't block or memory-leak the Flask app
        result = subprocess.run(['python', train_script], capture_output=True, text=True, check=True)
        return {"success": True, "output": result.stdout}
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": e.stderr}

def get_dataset_info():
    if not os.path.exists(META_PATH):
        return None
    with open(META_PATH, 'r') as f:
        return json.load(f)

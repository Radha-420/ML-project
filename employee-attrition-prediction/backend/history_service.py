import os
import csv
from datetime import datetime
import uuid

# Local CSV data path
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'prediction_history.csv')

def init_csv():
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
    if not os.path.exists(CSV_PATH):
        with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'employee_reference', 'prediction', 'probability', 'risk_level', 'created_at'])

def save_prediction(employee_ref, prediction, probability, risk_level):
    init_csv()
    pred_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    
    with open(CSV_PATH, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([pred_id, employee_ref, prediction, probability, risk_level, created_at])
        
    return pred_id

def get_prediction_history(limit=50):
    init_csv()
    records = []
    with open(CSV_PATH, mode='r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append({
                'id': row['id'],
                'employee_reference': row['employee_reference'],
                'prediction': row['prediction'],
                'probability': float(row['probability']),
                'risk_level': row['risk_level'],
                'created_at': row['created_at']
            })
    # Return newest first
    records.reverse()
    return records[:limit]

def get_statistics():
    init_csv()
    stats = {
        'total_predictions': 0,
        'high_risk': 0,
        'medium_risk': 0,
        'low_risk': 0,
        'predicted_yes': 0,
        'predicted_no': 0
    }
    
    with open(CSV_PATH, mode='r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            stats['total_predictions'] += 1
            if row['risk_level'] == 'High':
                stats['high_risk'] += 1
            elif row['risk_level'] == 'Medium':
                stats['medium_risk'] += 1
            elif row['risk_level'] == 'Low':
                stats['low_risk'] += 1
                
            if row['prediction'] == 'Yes':
                stats['predicted_yes'] += 1
            elif row['prediction'] == 'No':
                stats['predicted_no'] += 1
                
    return stats

def delete_prediction(pred_id):
    init_csv()
    records = []
    found = False
    
    with open(CSV_PATH, mode='r', newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        if not header:
            return False
            
        for row in reader:
            if row and row[0] == pred_id:
                found = True
            else:
                records.append(row)
                
    if found:
        with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(records)
            
    return found

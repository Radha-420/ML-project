import pandas as pd
import numpy as np
import os
import joblib
import json
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

def train_pipeline():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.abspath(os.path.join(base_dir, '..', '..', 'backend', 'database', 'employee_attrition_single_company.csv'))
    models_dir = os.path.abspath(os.path.join(base_dir, '..', 'models'))
    reports_dir = os.path.abspath(os.path.join(base_dir, '..', 'reports'))
    meta_dir = os.path.abspath(os.path.join(base_dir, '..', '..', 'data'))
    
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(meta_dir, exist_ok=True)
    
    print(f"Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Missing {data_path}")
        
    df = pd.read_csv(data_path)
    
    # 1. Feature Identification & Cleaning
    drop_cols = ['EmployeeCode', 'EmployeeID', 'EmployeeName', 'EmpID', 'empid']
    for col in drop_cols:
        if col in df.columns:
            df = df.drop(columns=[col])
            
    target_col = 'Attrition'
    X = df.drop(columns=[target_col])
    y = df[target_col].map({'Yes': 1, 'No': 0})
    
    # 2. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 3. Preprocessing
    numeric_features = X_train.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X_train.select_dtypes(include=['object', 'category']).columns.tolist()

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
        
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # Save Pipeline
    joblib.dump(preprocessor, os.path.join(models_dir, 'preprocessing_pipeline.pkl'))
    print("Preprocessing pipeline saved.")
    
    # 4. Model Training
    from sklearn.utils.class_weight import compute_class_weight
    weights = compute_class_weight(class_weight='balanced', classes=np.unique(y_train), y=y_train)
    scale_pos_weight = weights[1] / weights[0]
    
    models = {
        'Logistic Regression': LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(class_weight='balanced', max_depth=10, random_state=42),
        'Random Forest': RandomForestClassifier(class_weight='balanced', n_estimators=100, max_depth=10, random_state=42),
        'XGBoost': XGBClassifier(scale_pos_weight=scale_pos_weight, eval_metric='logloss', random_state=42)
    }
    
    results = []
    
    with open(os.path.join(reports_dir, 'classification_report.txt'), 'w') as f:
        for name, model in models.items():
            model.fit(X_train_processed, y_train)
            y_pred = model.predict(X_test_processed)
            y_prob = model.predict_proba(X_test_processed)[:, 1] if hasattr(model, "predict_proba") else None
            
            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, zero_division=0)
            rec = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            roc_auc = roc_auc_score(y_test, y_prob) if y_prob is not None else 0
            
            results.append({'Model': name, 'Accuracy': acc, 'Precision': prec, 'Recall': rec, 'F1': f1, 'ROC-AUC': roc_auc})
            f.write(f"--- {name} ---\n{classification_report(y_test, y_pred)}\n\n")
            
            joblib.dump(model, os.path.join(models_dir, f'{name.replace(" ", "_")}_model.pkl'))
            
    # 5. Model Selection
    results_df = pd.DataFrame(results)
    results_df.to_csv(os.path.join(reports_dir, 'model_comparison.csv'), index=False)
    
    best_model_row = results_df.loc[results_df['F1'].idxmax()]
    best_model_name = best_model_row['Model']
    print(f"Best Model selected: {best_model_name}")
    
    import shutil
    shutil.copy(os.path.join(models_dir, f'{best_model_name.replace(" ", "_")}_model.pkl'), 
                os.path.join(models_dir, 'best_model.pkl'))
                
    # 6. Save Metadata
    trained_at = datetime.now().strftime("%d %b %Y")
    
    metadata = {
        "company": "NovaTech Systems",
        "dataset": "employees.csv",
        "target": "Attrition",
        "model": best_model_name,
        "trained_at": trained_at,
        "training_records": len(df),
        "metrics": best_model_row.to_dict()
    }
    
    with open(os.path.join(models_dir, 'model_metadata.json'), 'w') as mf:
        json.dump(metadata, mf, indent=4)
        
    with open(os.path.join(meta_dir, 'company_metadata.json'), 'w') as cmf:
        json.dump(metadata, cmf, indent=4)
        
    print("Training pipeline complete.")

if __name__ == "__main__":
    train_pipeline()

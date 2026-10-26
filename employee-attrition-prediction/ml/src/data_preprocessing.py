import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

def load_data(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Data file not found at {file_path}")
    return pd.read_csv(file_path)

def create_preprocessing_pipeline(X):
    # Identify numerical and categorical columns
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()

    # Numerical pipeline: Impute missing values with median, then scale
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # Categorical pipeline: Impute missing with 'missing', then OneHotEncode
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # Combine using ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    return preprocessor

def preprocess_data(data_path, output_dir):
    print("--- Starting Data Preprocessing ---")
    df = load_data(data_path)
    
    # Separate features and target
    target_col = 'Attrition'
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset.")
        
    X = df.drop(columns=[target_col])
    # Map target 'Yes'/'No' to 1/0
    y = df[target_col].map({'Yes': 1, 'No': 0})
    
    print(f"Features shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    
    # Train-test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Create and fit the pipeline on training data ONLY
    preprocessor = create_preprocessing_pipeline(X_train)
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    print(f"Processed X_train shape: {X_train_processed.shape}")
    print(f"Processed X_test shape: {X_test_processed.shape}")
    
    # Save the pipeline for inference
    pipeline_path = os.path.join(output_dir, 'preprocessing_pipeline.pkl')
    joblib.dump(preprocessor, pipeline_path)
    print(f"Preprocessing pipeline saved to {pipeline_path}")
    
    # Save the processed splits for model training
    pd.DataFrame(X_train_processed).to_csv(os.path.join(output_dir, 'X_train.csv'), index=False)
    pd.DataFrame(X_test_processed).to_csv(os.path.join(output_dir, 'X_test.csv'), index=False)
    y_train.to_csv(os.path.join(output_dir, 'y_train.csv'), index=False)
    y_test.to_csv(os.path.join(output_dir, 'y_test.csv'), index=False)
    print("Train and test splits saved successfully.")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    data_file = os.path.join(base_dir, '..', 'data', 'employee_attrition_engineered.csv')
    models_dir = os.path.join(base_dir, '..', 'models')
    data_out_dir = os.path.join(base_dir, '..', 'data')
    
    os.makedirs(models_dir, exist_ok=True)
    preprocess_data(data_file, data_out_dir)
    
    # Move the pipeline to the models directory as requested by architecture
    os.replace(os.path.join(data_out_dir, 'preprocessing_pipeline.pkl'), 
               os.path.join(models_dir, 'preprocessing_pipeline.pkl'))
    print(f"Pipeline moved to {models_dir}")

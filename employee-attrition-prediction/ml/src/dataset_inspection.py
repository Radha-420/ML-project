import pandas as pd
import os

def inspect_dataset(file_path):
    print(f"--- Inspecting Dataset: {file_path} ---")
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    df = pd.read_csv(file_path)
    print(f"\n1. Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    print("\n2. First 5 Rows:")
    print(df.head())
    
    print("\n3. Data Types:")
    print(df.dtypes)
    
    print("\n4. Missing Values:")
    missing = df.isnull().sum()
    print(missing[missing > 0] if missing.sum() > 0 else "No missing values found.")
    
    print("\n5. Duplicate Rows:")
    print(f"Total duplicate rows: {df.duplicated().sum()}")
    
    print("\n6. Target Variable ('Attrition') Distribution:")
    if 'Attrition' in df.columns:
        print(df['Attrition'].value_counts(normalize=True) * 100)
    else:
        print("Warning: 'Attrition' column not found in dataset!")

if __name__ == "__main__":
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'employee_attrition.csv')
    inspect_dataset(data_path)

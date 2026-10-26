import pandas as pd
import os

def engineer_features(data_path, output_path):
    print("--- Starting Feature Engineering ---")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}")
        
    df = pd.read_csv(data_path)
    
    # Feature 1: Tenure per job (Total Working Years / (Number of Companies Worked + 1 to avoid div by zero))
    df['TenurePerJob'] = df['TotalWorkingYears'] / (df['NumCompaniesWorked'] + 1)
    
    # Feature 2: Overall Satisfaction (Sum of Environment, Job, and Relationship Satisfaction)
    df['OverallSatisfaction'] = df['EnvironmentSatisfaction'] + df['JobSatisfaction'] + df['RelationshipSatisfaction']
    
    # Feature 3: Years Without Promotion (Years at Company - Years Since Last Promotion)
    # Could indicate stagnation if high
    df['YearsWithoutPromotion'] = df['YearsAtCompany'] - df['YearsSinceLastPromotion']
    
    print(f"Created new features: TenurePerJob, OverallSatisfaction, YearsWithoutPromotion")
    print(f"New dataset shape: {df.shape}")
    
    df.to_csv(output_path, index=False)
    print(f"Engineered dataset saved to {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    data_file = os.path.join(base_dir, '..', 'data', 'employee_attrition.csv')
    engineered_file = os.path.join(base_dir, '..', 'data', 'employee_attrition_engineered.csv')
    
    engineer_features(data_file, engineered_file)

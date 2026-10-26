import pandas as pd
import numpy as np
import os
import random

def generate_sample_dataset(file_path, n_samples=1000):
    np.random.seed(42)
    random.seed(42)
    
    first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha", "Arjun", "Pooja", "Karan", "Riya", "Aditya", "Kavya", "Siddharth", "Aisha", "Varun", "Shruti", "Rishabh", "Megha", "John", "Sarah", "David", "Emma", "Michael", "Olivia"]
    last_names = ["Sharma", "Verma", "Kumar", "Singh", "Gupta", "Patel", "Reddy", "Rao", "Jain", "Mehta", "Bose", "Chopra", "Das", "Yadav", "Iyer", "Nair", "Menon", "Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson"]

    departments = ['Engineering', 'Product', 'IT Infrastructure', 'Quality Assurance', 'Data & Analytics', 'Cyber Security', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Customer Success']
    
    def get_role_for_dept(dept):
        if dept == 'Engineering': return np.random.choice(['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager'])
        if dept == 'Data & Analytics': return np.random.choice(['Data Analyst', 'Data Scientist', 'ML Engineer'])
        if dept == 'IT Infrastructure': return np.random.choice(['DevOps Engineer', 'Cloud Engineer'])
        if dept == 'Cyber Security': return 'Cyber Security Analyst'
        if dept == 'Quality Assurance': return 'QA Engineer'
        if dept == 'Product': return 'Product Manager'
        if dept == 'Human Resources': return np.random.choice(['HR Executive', 'HR Manager'])
        if dept == 'Finance': return 'Financial Analyst'
        if dept == 'Sales': return np.random.choice(['Sales Executive', 'Sales Manager'])
        if dept == 'Marketing': return 'Marketing Specialist'
        if dept == 'Customer Success': return 'Customer Success Executive'
        return 'Software Engineer'

    depts = np.random.choice(departments, n_samples, p=[0.3, 0.05, 0.1, 0.05, 0.1, 0.05, 0.05, 0.05, 0.1, 0.05, 0.1])
    roles = [get_role_for_dept(d) for d in depts]
    
    data = {
        'EmployeeID': [f"NTS{str(i).zfill(3)}" for i in range(1, n_samples + 1)],
        'EmployeeName': [f"{random.choice(first_names)} {random.choice(last_names)}" for _ in range(n_samples)],
        'Age': np.random.randint(22, 60, n_samples),
        'Gender': np.random.choice(['Male', 'Female'], n_samples),
        'Department': depts,
        'JobRole': roles,
        'JobLevel': np.random.randint(1, 6, n_samples),
        'MonthlyIncome': np.random.randint(30000, 250000, n_samples),
        'TotalWorkingYears': np.random.randint(0, 40, n_samples),
        'YearsAtCompany': np.random.randint(0, 20, n_samples),
        'YearsInCurrentRole': np.random.randint(0, 10, n_samples),
        'YearsSinceLastPromotion': np.random.randint(0, 10, n_samples),
        'YearsWithCurrManager': np.random.randint(0, 10, n_samples),
        'NumCompaniesWorked': np.random.randint(0, 8, n_samples),
        'OverTime': np.random.choice(['Yes', 'No'], n_samples, p=[0.3, 0.7]),
        'JobSatisfaction': np.random.randint(1, 5, n_samples),
        'EnvironmentSatisfaction': np.random.randint(1, 5, n_samples),
        'RelationshipSatisfaction': np.random.randint(1, 5, n_samples),
        'WorkLifeBalance': np.random.randint(1, 5, n_samples),
        'JobInvolvement': np.random.randint(1, 5, n_samples),
        'PerformanceRating': np.random.choice([3, 4], n_samples, p=[0.8, 0.2]),
        'BusinessTravel': np.random.choice(['Travel_Rarely', 'Travel_Frequently', 'Non-Travel'], n_samples, p=[0.7, 0.2, 0.1]),
        'DistanceFromHome': np.random.randint(1, 30, n_samples),
        'Education': np.random.randint(1, 6, n_samples),
        'EducationField': np.random.choice(['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Other', 'Human Resources'], n_samples),
        'TrainingTimesLastYear': np.random.randint(0, 7, n_samples),
        'Attrition': np.random.choice(['Yes', 'No'], n_samples, p=[0.15, 0.85]),
    }
    
    df = pd.DataFrame(data)
    
    # Introduce reasonable correlations for ML
    attrition_mask = (df['JobSatisfaction'] <= 2) & (df['OverTime'] == 'Yes')
    df.loc[attrition_mask, 'Attrition'] = np.random.choice(['Yes', 'No'], attrition_mask.sum(), p=[0.6, 0.4])
    
    attrition_mask_2 = (df['YearsSinceLastPromotion'] > 5) & (df['PerformanceRating'] == 4)
    df.loc[attrition_mask_2, 'Attrition'] = np.random.choice(['Yes', 'No'], attrition_mask_2.sum(), p=[0.7, 0.3])

    df.to_csv(file_path, index=False)
    print(f"NovaTech Systems synthetic dataset created at: {file_path}")

if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    data_path = os.path.join(data_dir, 'employees.csv')
    generate_sample_dataset(data_path)

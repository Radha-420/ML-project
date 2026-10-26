import pandas as pd
import os

from backend.config import Config

BASE_DIR = os.path.dirname(__file__)
CSV_PATH = Config.CSV_PATH

def get_analytics_data():
    if not os.path.exists(CSV_PATH):
        return {}
        
    df = pd.read_csv(CSV_PATH)
    
    dept_col = 'Department' if 'Department' in df.columns else ('Dept' if 'Dept' in df.columns else None)
    role_col = 'JobRole' if 'JobRole' in df.columns else ('Role' if 'Role' in df.columns else None)
    ot_col = 'OverTime' if 'OverTime' in df.columns else ('Overtime' if 'Overtime' in df.columns else None)
    salary_col = 'MonthlyIncome' if 'MonthlyIncome' in df.columns else ('Salary' if 'Salary' in df.columns else None)
    
    dept_attr_data = []
    if dept_col and 'Attrition' in df.columns:
        dept_attr = df.groupby([dept_col, 'Attrition']).size().unstack(fill_value=0).reset_index()
        dept_attr = dept_attr.rename(columns={dept_col: 'Department'})
        dept_attr_data = dept_attr.to_dict(orient='records')
        
    role_attr_data = []
    if role_col and 'Attrition' in df.columns:
        role_attr = df.groupby([role_col, 'Attrition']).size().unstack(fill_value=0).reset_index()
        role_attr = role_attr.rename(columns={role_col: 'JobRole'})
        role_attr_data = role_attr.to_dict(orient='records')
        
    ot_attr_data = []
    if ot_col and 'Attrition' in df.columns:
        ot_attr = df.groupby([ot_col, 'Attrition']).size().unstack(fill_value=0).reset_index()
        ot_attr = ot_attr.rename(columns={ot_col: 'OverTime'})
        ot_attr_data = ot_attr.to_dict(orient='records')
        
    salary_attr_data = []
    if salary_col and 'Attrition' in df.columns:
        df['SalaryRange'] = pd.cut(df[salary_col], bins=[-1, 50000, 100000, 150000, 200000, float('inf')], 
                                   labels=['0-50k', '50k-100k', '100k-150k', '150k-200k', '200k+'])
        salary_attr = df.groupby(['SalaryRange', 'Attrition']).size().unstack(fill_value=0).reset_index()
        salary_attr_data = salary_attr.to_dict(orient='records')
    
    return {
        'department': dept_attr_data,
        'role': role_attr_data,
        'overtime': ot_attr_data,
        'salary': salary_attr_data,
        'total_employees': len(df),
        'active_employees': len(df[df['Attrition'] == 'No']),
        'historical_attrition': len(df[df['Attrition'] == 'Yes'])
    }

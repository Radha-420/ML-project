import pandas as pd
import os

from backend.config import Config

BASE_DIR = os.path.dirname(__file__)
CSV_PATH = Config.CSV_PATH

def get_all_employees():
    if not os.path.exists(CSV_PATH):
        return []
    
    df = pd.read_csv(CSV_PATH)
    
    # Identify the ID column
    id_col = 'EmployeeCode' if 'EmployeeCode' in df.columns else 'EmployeeID' if 'EmployeeID' in df.columns else 'EmpID' if 'EmpID' in df.columns else df.columns[0]
    name_col = 'EmployeeName' if 'EmployeeName' in df.columns else 'Name' if 'Name' in df.columns else None
    dept_col = 'Department' if 'Department' in df.columns else 'Dept' if 'Dept' in df.columns else None
    role_col = 'JobRole' if 'JobRole' in df.columns else 'Role' if 'Role' in df.columns else None
    
    # We send all fields, let frontend figure it out, or pick a few known ones
    records = df.to_dict(orient='records')
    # Standardize basic keys for the frontend
    for r in records:
        r['id'] = r.get(id_col, 'Unknown')
        r['EmployeeID'] = r['id']
        if name_col: r['EmployeeName'] = r.get(name_col, '')
        if dept_col: r['Department'] = r.get(dept_col, '')
        if role_col: r['JobRole'] = r.get(role_col, '')
        
    return records

def get_employee_by_id(emp_id):
    if not os.path.exists(CSV_PATH):
        return None
        
    df = pd.read_csv(CSV_PATH)
    
    search_val = str(emp_id).lower()
    employee = pd.DataFrame()
    
    # Search multiple potential identifier columns
    for col in ['EmployeeCode', 'EmployeeID', 'EmpID', df.columns[0]]:
        if col in df.columns:
            match = df[df[col].astype(str).str.lower() == search_val]
            if not match.empty:
                employee = match
                id_col = col
                break
    
    if employee.empty:
        return None
        
    data = employee.iloc[0].to_dict()
    # Provide the standard ID key for the frontend
    data['EmployeeID'] = data.get(id_col, emp_id)
    return data

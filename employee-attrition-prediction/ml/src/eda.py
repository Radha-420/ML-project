import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

def run_eda(data_path, output_dir):
    print("--- Starting Exploratory Data Analysis ---")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}")
        
    df = pd.read_csv(data_path)
    os.makedirs(output_dir, exist_ok=True)
    
    sns.set_theme(style="whitegrid")

    # 1. Attrition Distribution
    plt.figure(figsize=(6, 4))
    sns.countplot(data=df, x='Attrition', palette='Set2')
    plt.title('Attrition Distribution')
    plt.savefig(os.path.join(output_dir, 'attrition_distribution.png'))
    plt.close()

    # 2. Attrition vs Age
    plt.figure(figsize=(8, 5))
    sns.histplot(data=df, x='Age', hue='Attrition', multiple='stack', palette='Set2', bins=30)
    plt.title('Age Distribution by Attrition')
    plt.savefig(os.path.join(output_dir, 'attrition_vs_age.png'))
    plt.close()

    # 3. Attrition vs Monthly Income
    plt.figure(figsize=(8, 5))
    sns.histplot(data=df, x='MonthlyIncome', hue='Attrition', multiple='stack', palette='Set2', bins=30)
    plt.title('Monthly Income Distribution by Attrition')
    plt.savefig(os.path.join(output_dir, 'attrition_vs_income.png'))
    plt.close()

    # 4. Attrition vs Job Satisfaction
    plt.figure(figsize=(6, 4))
    sns.countplot(data=df, x='JobSatisfaction', hue='Attrition', palette='Set2')
    plt.title('Job Satisfaction vs Attrition')
    plt.savefig(os.path.join(output_dir, 'attrition_vs_jobsatisfaction.png'))
    plt.close()

    # 5. Attrition vs Overtime
    plt.figure(figsize=(6, 4))
    sns.countplot(data=df, x='OverTime', hue='Attrition', palette='Set2')
    plt.title('OverTime vs Attrition')
    plt.savefig(os.path.join(output_dir, 'attrition_vs_overtime.png'))
    plt.close()

    # 6. Attrition vs Job Role
    plt.figure(figsize=(12, 6))
    sns.countplot(data=df, y='JobRole', hue='Attrition', palette='Set2')
    plt.title('Job Role vs Attrition')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'attrition_vs_jobrole.png'))
    plt.close()

    # 7. Correlation Matrix (Numerical Features only)
    plt.figure(figsize=(14, 10))
    # Map Attrition temporarily for correlation
    df_corr = df.copy()
    df_corr['Attrition_Numeric'] = df_corr['Attrition'].map({'Yes': 1, 'No': 0})
    num_cols = df_corr.select_dtypes(include=[np.number]).columns
    corr = df_corr[num_cols].corr()
    
    sns.heatmap(corr, cmap='coolwarm', annot=False, fmt='.2f', linewidths=0.5)
    plt.title('Correlation Matrix of Numerical Features')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'correlation_matrix.png'))
    plt.close()

    print(f"EDA completed successfully. Plots saved to: {output_dir}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    data_file = os.path.join(base_dir, '..', 'data', 'employee_attrition.csv')
    eda_output_dir = os.path.join(base_dir, '..', 'reports', 'eda')
    
    run_eda(data_file, eda_output_dir)

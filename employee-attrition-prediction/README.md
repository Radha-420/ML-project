# Employee Attrition Prediction Using Machine Learning

## 1. Project Overview
This is a complete Machine Learning web application designed to predict whether an employee is likely to leave an organization (Attrition). It is designed to run entirely locally, making it perfectly suited for academic projects, vivas, and local demonstrations.

## 2. Problem Statement & Objectives
Employee attrition causes disruption and incurs significant hiring costs. The objective of this project is to use historical HR data to identify employees at high risk of leaving, allowing management to take proactive retention measures. The system provides a predicted outcome ("Yes" or "No"), a probability score, and a calculated Risk Level (Low/Medium/High).

## 3. Dataset
This project uses a standard employee attrition dataset (such as the IBM HR Analytics dataset).
**Setup:** Ensure your CSV file is placed exactly at `ml/data/employee_attrition.csv` before training the models. The application dynamically inspects the columns present in the CSV to adjust the preprocessing pipeline.

## 4. Architecture & Technology Stack
- **Machine Learning (Python, Scikit-learn, XGBoost):** Data loading, Exploratory Data Analysis (EDA), stratified training, and model selection.
- **Backend API (Flask):** Serves predictions, metadata, and history metrics via REST endpoints.
- **Data Storage (CSV):** Prediction history is appended to `data/prediction_history.csv`.
- **Frontend Dashboard (React, Vite):** Modern responsive UI with Recharts for visualization.

## 5. ML Workflow
1. **EDA:** Generates plots for analyzing distribution and correlations (saved in `ml/plots/`).
2. **Preprocessing:** Handles missing values, encodes categorical variables, and scales numerical variables.
3. **Training:** Trains Logistic Regression, Decision Tree, Random Forest, and XGBoost models. Imbalanced classes are handled using class weights.
4. **Evaluation:** Models are evaluated on Precision, Recall, F1-Score, ROC-AUC, and Accuracy.
5. **Selection:** The best model is automatically saved (`best_model.pkl`) alongside the preprocessing pipeline.

## 6. How to Run the Project Locally
Ensure you have Python 3.11+ and Node.js installed.

**Step 1: Install Python Requirements**
```bash
pip install -r requirements.txt
```

**Step 2: Start Everything**
Run the Windows batch file from the root directory:
```bash
run_project.bat
```
This script will automatically:
1. Train the ML models.
2. Launch the Flask backend (`http://localhost:5000`).
3. Install frontend dependencies and launch the React dashboard (`http://localhost:5173`).

## 7. API Endpoints
- `GET /api/health`: Server status.
- `GET /api/model-info`: Retrieves the evaluation metrics of the active ML model.
- `POST /api/predict`: Generates an attrition prediction from JSON employee data.
- `GET /api/history`: Retrieves the prediction log.
- `GET /api/statistics`: Retrieves aggregated historical risk statistics.

## 8. Limitations & Future Enhancements
- **Limitations:** Predictions are probabilistic, not absolute certainties. Model effectiveness heavily relies on the quality and unbiased nature of the input dataset.
- **Future Enhancements:** Incorporating Explainable AI (e.g., SHAP) to show exactly which features contributed most to a specific prediction.

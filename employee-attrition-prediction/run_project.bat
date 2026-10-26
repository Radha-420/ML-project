@echo off
echo ==============================================
echo Employee Attrition Prediction - Project Runner
echo ==============================================

echo [1/3] Training Machine Learning Models...
python ml/src/train.py

echo [2/3] Starting Flask Backend (New Window)...
start cmd /k "cd backend && python app.py"

echo [3/3] Starting React Frontend (New Window)...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo All services started!
echo Frontend is available at: http://localhost:5173
echo Backend is available at:  http://localhost:5000
echo ==============================================
pause

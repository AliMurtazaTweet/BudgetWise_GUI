@echo off
TITLE BudgetWise Suite Manager
COLOR 0A

echo Checking if required services are ready...
echo [1/2] Launching Next.js Frontend (Port: 3000)...
start "BudgetWise Frontend" /B npm.cmd run dev

echo [2/2] Connecting C++ Financial Engine (Port: 8080)...
start "BudgetWise Backend" /B .\backend\budgetwise_server.exe

echo.
echo ==================================================
echo SUCCESS: BudgetWise Financial Suite is now LIVE!
echo ==================================================
echo Dashboard: http://localhost:3000
echo Core API: http://localhost:8080/api
echo ==================================================
echo.
echo Please keep this window open while using the application.
echo To stop all services, just close this terminal and use 'Stop-Process' if needed.
pause

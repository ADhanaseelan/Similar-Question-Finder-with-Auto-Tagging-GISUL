@echo off
echo ========================================================
echo Starting LearnConnect Full Stack Environment...
echo ========================================================
echo.

echo [1/2] Starting Python Backend Server...
start "LearnConnect Backend" cmd /k "cd backend && python main.py"

echo [2/2] Starting Next.js Frontend Server...
start "LearnConnect Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Success! Both servers are spinning up in new windows.
echo You can close this script window now.
echo.
pause

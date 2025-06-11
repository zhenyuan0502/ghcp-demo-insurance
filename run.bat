@echo off
REM Batch script to run the insurance app locally

echo 🚀 Starting Insurance App...

REM Check prerequisites
echo 📋 Checking prerequisites...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js/npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo 🔧 Setting up backend...
cd backend

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

REM Initialize database if it doesn't exist
if not exist "instance\insurance.db" (
    echo Initializing database...
    python -c "from app import app, db; app.app_context().push(); db.create_all()"
)

cd ..

REM Setup frontend
echo 🔧 Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
)

cd ..

REM Start both services
echo 🚀 Starting services...

REM Start backend in new window
echo Starting Flask backend on http://localhost:5000...
start "Flask Backend" cmd /k "cd /d %CD%\backend && venv\Scripts\activate.bat && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting React frontend on http://localhost:3000...
cd frontend
npm start

cd ..

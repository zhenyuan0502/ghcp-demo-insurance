#!/usr/bin/env pwsh
# PowerShell script to run the insurance app locally

Write-Host "🚀 Starting Insurance App..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to check if PostgreSQL is running
function Test-PostgreSQL {
    try {
        $result = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue -ErrorAction Stop
        return $result.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

# Function to read .env file
function Read-EnvFile($path) {
    $env = @{}
    if (Test-Path $path) {
        Get-Content $path | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)\s*$') {
                $env[$matches[1]] = $matches[2]
            }
        }
    }
    return $env
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "python")) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ Node.js/npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Check database configuration
Write-Host "🗄️ Checking database configuration..." -ForegroundColor Yellow
$backendEnv = Read-EnvFile "backend-py\.env"
$dbType = $backendEnv["DATABASE_TYPE"]

if ($dbType -eq "postgresql") {
    Write-Host "PostgreSQL database mode detected..." -ForegroundColor Cyan
    if (Test-PostgreSQL) {
        Write-Host "✅ PostgreSQL is running on localhost:5432" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  PostgreSQL is not running on localhost:5432" -ForegroundColor Red
        Write-Host "   Please start PostgreSQL or use Docker Compose:" -ForegroundColor Yellow
        Write-Host "   docker-compose -f docker-compose.python.yml up postgres -d" -ForegroundColor Cyan
        $choice = Read-Host "Continue anyway? (y/N)"
        if ($choice -ne "y" -and $choice -ne "Y") {
            exit 1
        }
    }
}
else {
    Write-Host "SQLite database mode detected..." -ForegroundColor Cyan
}

# Install backend dependencies if needed
Write-Host "🔧 Setting up backend..." -ForegroundColor Yellow
Push-Location backend-py

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Initialize database if it doesn't exist (SQLite only)
if ($dbType -ne "postgresql" -and -not (Test-Path "instance\insurance.db")) {
    Write-Host "Initializing SQLite database..." -ForegroundColor Cyan
    python -c "from app import app, db; app.app_context().push(); db.create_all()"
}

Pop-Location

# Install frontend dependencies if needed
Write-Host "🔧 Setting up frontend..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
    npm install
}

Pop-Location

# Start both services
Write-Host "🚀 Starting services..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting Flask backend on http://localhost:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend-py'; .\venv\Scripts\Activate.ps1; python app.py" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting React frontend on http://localhost:3000..." -ForegroundColor Cyan
Push-Location frontend
npm start

Pop-Location

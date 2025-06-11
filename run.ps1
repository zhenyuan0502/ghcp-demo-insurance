#!/usr/bin/env pwsh
# PowerShell script to run the insurance app locally

Write-Host "🚀 Starting Insurance App..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
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

# Install backend dependencies if needed
Write-Host "🔧 Setting up backend..." -ForegroundColor Yellow
Push-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Initialize database if it doesn't exist
if (-not (Test-Path "instance\insurance.db")) {
    Write-Host "Initializing database..." -ForegroundColor Cyan
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
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; python app.py" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting React frontend on http://localhost:3000..." -ForegroundColor Cyan
Push-Location frontend
npm start

Pop-Location

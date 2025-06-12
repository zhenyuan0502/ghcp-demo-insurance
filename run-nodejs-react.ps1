#!/usr/bin/env pwsh
# PowerShell script to run the insurance app with Node.js backend locally

Write-Host "🚀 Starting Insurance App (Node.js Backend)..." -ForegroundColor Green

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

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Check database configuration
Write-Host "🗄️ Checking database configuration..." -ForegroundColor Yellow
$backendEnv = Read-EnvFile "backend-nodejs\.env"
$dbType = $backendEnv["DATABASE_TYPE"]

if ($dbType -eq "postgresql") {
    Write-Host "PostgreSQL database mode detected..." -ForegroundColor Cyan
    if (Test-PostgreSQL) {
        Write-Host "✅ PostgreSQL is running on localhost:5432" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  PostgreSQL is not running on localhost:5432" -ForegroundColor Red
        Write-Host "   Please start PostgreSQL or use Docker Compose:" -ForegroundColor Yellow
        Write-Host "   docker-compose up postgres -d" -ForegroundColor Cyan
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
Write-Host "🔧 Setting up Node.js backend..." -ForegroundColor Yellow
Push-Location backend-nodejs

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies for backend..." -ForegroundColor Cyan
    npm install
}

# Create instance directory if it doesn't exist
if (-not (Test-Path "instance")) {
    Write-Host "Creating instance directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "instance" -Force
}

Pop-Location

# Install frontend dependencies if needed
Write-Host "🔧 Setting up frontend..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies for frontend..." -ForegroundColor Cyan
    npm install
}

Pop-Location

# Start both services
Write-Host "🚀 Starting services..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting Node.js backend on http://localhost:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend-nodejs'; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting React frontend on http://localhost:3000..." -ForegroundColor Cyan
Push-Location frontend
npm start

Pop-Location
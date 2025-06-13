#!/usr/bin/env pwsh
# PowerShell script to run all unit tests for the insurance app

Write-Host "🧪 Running All Unit Tests for Insurance App..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Track test results
$testResults = @()

# Test Backend Python
Write-Host "`n📋 Testing Backend Python..." -ForegroundColor Yellow
Push-Location backend-py

if (-not (Test-Command "python")) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    $testResults += "Backend-Python: SKIPPED (Python not found)"
}
else {
    # Check if virtual environment exists, create if not
    if (-not (Test-Path "venv")) {
        Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
        python -m venv venv
    }

    Write-Host "Running backend-py/run_tests.ps1..." -ForegroundColor Cyan
    $pythonResult = & ./run_tests.ps1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python backend tests PASSED" -ForegroundColor Green
        $testResults += "Backend-Python: PASSED"
    }
    else {
        Write-Host "❌ Python backend tests FAILED" -ForegroundColor Red
        $testResults += "Backend-Python: FAILED"
    }
}

Pop-Location

# Test Backend Node.js
Write-Host "`n📋 Testing Backend Node.js..." -ForegroundColor Yellow
Push-Location backend-nodejs

if (-not (Test-Command "npm")) {
    Write-Host "❌ Node.js/npm is not installed or not in PATH" -ForegroundColor Red
    $testResults += "Backend-NodeJS: SKIPPED (npm not found)"
}
else {
    Write-Host "Installing/updating dependencies..." -ForegroundColor Cyan
    npm install

    Write-Host "Running Node.js tests..." -ForegroundColor Cyan
    $nodejsResult = npm test --run --verbose
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js backend tests PASSED" -ForegroundColor Green
        $testResults += "Backend-NodeJS: PASSED"
    }
    else {
        Write-Host "❌ Node.js backend tests FAILED" -ForegroundColor Red
        $testResults += "Backend-NodeJS: FAILED"
    }
}

Pop-Location

# Test Frontend React
Write-Host "`n📋 Testing Frontend React..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Command "npm")) {
    Write-Host "❌ Node.js/npm is not installed or not in PATH" -ForegroundColor Red
    $testResults += "Frontend-React: SKIPPED (npm not found)"
}
else {
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
        npm install
    }

    Write-Host "Running React tests..." -ForegroundColor Cyan
    $reactResult = npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ React frontend tests PASSED" -ForegroundColor Green
        $testResults += "Frontend-React: PASSED"
    }
    else {
        Write-Host "❌ React frontend tests FAILED" -ForegroundColor Red
        $testResults += "Frontend-React: FAILED"
    }
}

Pop-Location

# Summary
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Magenta
foreach ($result in $testResults) {
    if ($result -like "*PASSED*") {
        Write-Host $result -ForegroundColor Green
    }
    elseif ($result -like "*FAILED*") {
        Write-Host $result -ForegroundColor Red
    }
    else {
        Write-Host $result -ForegroundColor Yellow
    }
}

# Check if all tests passed
$failed = $testResults | Where-Object { $_ -like "*FAILED*" }
$skipped = $testResults | Where-Object { $_ -like "*SKIPPED*" }

if ($failed.Count -eq 0 -and $skipped.Count -eq 0) {
    Write-Host "`n🎉 All tests PASSED!" -ForegroundColor Green
    exit 0
}
elseif ($failed.Count -eq 0) {
    Write-Host "`n⚠️ All available tests PASSED, but some were skipped due to missing dependencies" -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "`n💥 Some tests FAILED!" -ForegroundColor Red
    exit 1
}
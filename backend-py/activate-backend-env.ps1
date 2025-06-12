# PowerShell script to activate Python virtual environment in backend-py
# Usage: .\activate-backend-env.ps1

$envPath = Join-Path $PSScriptRoot "venv"

if (-Not (Test-Path $envPath)) {
    Write-Host "Virtual environment not found. Creating one in $envPath..."
    python -m venv $envPath
}

$activateScript = Join-Path $envPath "Scripts\Activate.ps1"

if (Test-Path $activateScript) {
    Write-Host "Activating virtual environment..."
    & $activateScript
} else {
    Write-Host "Activation script not found at $activateScript."
    exit 1
}

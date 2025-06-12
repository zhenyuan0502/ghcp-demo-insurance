# PowerShell script to activate Python virtual environment and run pytest

# Activate the virtual environment
. ./venv/Scripts/Activate.ps1

# Run pytest
pytest test_app.py -v

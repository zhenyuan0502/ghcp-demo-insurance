#!/bin/bash
# Bash script to run all unit tests for the insurance app

echo "🧪 Running All Unit Tests for Insurance App..."

# Function to check if a command exists
command_exists() {
    command -v "$1" > /dev/null 2>&1
}

# Track test results
test_results=()

# Test Backend Python
echo ""
echo "📋 Testing Backend Python..."
cd backend-py

if ! command_exists python && ! command_exists python3; then
    echo "❌ Python is not installed or not in PATH"
    test_results+=("Backend-Python: SKIPPED (Python not found)")
else
    # Use python3 if available, otherwise python
    PYTHON_CMD="python"
    if command_exists python3; then
        PYTHON_CMD="python3"
    fi

    # Check if virtual environment exists, create if not
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        $PYTHON_CMD -m venv venv
    fi

    echo "Activating virtual environment..."
    source venv/bin/activate

    echo "Installing/updating dependencies..."
    pip install -r requirements.txt

    echo "Running Python tests..."
    if pytest -v; then
        echo "✅ Python backend tests PASSED"
        test_results+=("Backend-Python: PASSED")
    else
        echo "❌ Python backend tests FAILED"
        test_results+=("Backend-Python: FAILED")
    fi
fi

cd ..

# Test Backend Node.js
echo ""
echo "📋 Testing Backend Node.js..."
cd backend-nodejs

if ! command_exists npm; then
    echo "❌ Node.js/npm is not installed or not in PATH"
    test_results+=("Backend-NodeJS: SKIPPED (npm not found)")
else
    echo "Installing/updating dependencies..."
    npm install

    echo "Running Node.js tests..."
    if npm test; then
        echo "✅ Node.js backend tests PASSED"
        test_results+=("Backend-NodeJS: PASSED")
    else
        echo "❌ Node.js backend tests FAILED"
        test_results+=("Backend-NodeJS: FAILED")
    fi
fi

cd ..

# Test Frontend React
echo ""
echo "📋 Testing Frontend React..."
cd frontend

if ! command_exists npm; then
    echo "❌ Node.js/npm is not installed or not in PATH"
    test_results+=("Frontend-React: SKIPPED (npm not found)")
else
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    fi

    echo "Running React tests..."
    if npm test; then
        echo "✅ React frontend tests PASSED"
        test_results+=("Frontend-React: PASSED")
    else
        echo "❌ React frontend tests FAILED"
        test_results+=("Frontend-React: FAILED")
    fi
fi

cd ..

# Summary
echo ""
echo "📊 Test Results Summary:"
echo "========================"
for result in "${test_results[@]}"; do
    if [[ $result == *"PASSED"* ]]; then
        echo -e "\033[0;32m$result\033[0m"  # Green
    elif [[ $result == *"FAILED"* ]]; then
        echo -e "\033[0;31m$result\033[0m"  # Red
    else
        echo -e "\033[0;33m$result\033[0m"  # Yellow
    fi
done

# Check if all tests passed
failed_count=0
skipped_count=0
for result in "${test_results[@]}"; do
    if [[ $result == *"FAILED"* ]]; then
        ((failed_count++))
    elif [[ $result == *"SKIPPED"* ]]; then
        ((skipped_count++))
    fi
done

if [ $failed_count -eq 0 ] && [ $skipped_count -eq 0 ]; then
    echo ""
    echo "🎉 All tests PASSED!"
    exit 0
elif [ $failed_count -eq 0 ]; then
    echo ""
    echo "⚠️ All available tests PASSED, but some were skipped due to missing dependencies"
    exit 0
else
    echo ""
    echo "💥 Some tests FAILED!"
    exit 1
fi
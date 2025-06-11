#!/bin/bash
# Bash script to run the insurance app locally (for Linux/macOS or WSL)

echo "🚀 Starting Insurance App..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ Node.js/npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

# Initialize database if it doesn't exist
if [ ! -f "instance/insurance.db" ]; then
    echo "Initializing database..."
    python -c "from app import app, db; app.app_context().push(); db.create_all()"
fi

cd ..

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

cd ..

# Start both services
echo "🚀 Starting services..."

# Start backend in background
echo "Starting Flask backend on http://localhost:5000..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting React frontend on http://localhost:3000..."
cd frontend
npm start

# Cleanup function
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for frontend to finish
wait

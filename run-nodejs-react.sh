#!/bin/bash
# Bash script to run the insurance app with Node.js backend locally (for Linux/macOS or WSL)

echo "🚀 Starting Insurance App (Node.js Backend)..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Node.js backend
echo "🔧 Setting up Node.js backend..."
cd backend-nodejs

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies for backend..."
    npm install
fi

# Create instance directory if it doesn't exist
if [ ! -d "instance" ]; then
    echo "Creating instance directory..."
    mkdir -p instance
fi

cd ..

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies for frontend..."
    npm install
fi

cd ..

# Start both services
echo "🚀 Starting services..."

# Start backend in background
echo "Starting Node.js backend on http://localhost:5000..."
cd backend-nodejs
npm start &
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
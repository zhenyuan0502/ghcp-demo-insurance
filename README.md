# ghcp-demo-insurance

[![CI/CD Tests and Coverage](https://github.com/zhenyuan0502/ghcp-demo-insurance/actions/workflows/ci.yml/badge.svg)](https://github.com/zhenyuan0502/ghcp-demo-insurance/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/zhenyuan0502/ghcp-demo-insurance/branch/main/graph/badge.svg)](https://codecov.io/gh/zhenyuan0502/ghcp-demo-insurance)

This project is a demo insurance application with a frontend and backend, designed for educational and demonstration purposes.

## Test Coverage

The project includes comprehensive test suites for all three services:

- **Backend Python**: 89% statement coverage with 14 test cases
- **Backend Node.js**: 70% statement coverage with 20 test cases  
- **Frontend React**: 100% coverage for tested components with 27 test cases

## Project Structure

- `backend/` - Python Flask backend
- `backend-nodejs/` - Node.js backend (Express)
- `backend-py/` - Alternative Python backend
- `frontend/` - React frontend (TypeScript, Vite)
- `database-postgres/` - PostgreSQL database setup and scripts

## Getting Started

### Prerequisites
- Node.js (for frontend and Node.js backend)
- Python 3 (for Python backend)
- npm (for frontend and Node.js backend)
- Docker (optional, for containerized setup)

### Setup

#### 1. Install Dependencies
- **Frontend:**
  ```sh
  cd frontend
  npm install
  ```
- **Backend (Python):**
  ```sh
  cd backend
  pip install -r requirements.txt
  ```
- **Backend (Node.js):**
  ```sh
  cd backend-nodejs
  npm install
  ```

#### 2. Running the App
- **Frontend:**
  ```sh
  npm start
  ```
- **Backend (Python):**
  ```sh
  python app.py
  ```
- **Backend (Node.js):**
  ```sh
  node app.js
  ```

#### 3. Docker Compose
- To run the full stack with Docker Compose:
  ```sh
  docker-compose up
  ```
  See the various `docker-compose.*.yml` files for different configurations.

## Testing
- **Frontend:**
  ```sh
  npm test
  ```
- **Backend (Python):**
  ```sh
  pytest
  ```
- **Backend (Node.js):**
  ```sh
  npm test
  ```

## Additional Scripts
- See `run_test.sh`, `run_test.ps1`, and other scripts for automation.

## License
This project is for demo purposes only.

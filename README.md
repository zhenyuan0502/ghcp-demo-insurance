# ghcp-demo-insurance

This project is a demo insurance application with a frontend and backend, designed for educational and demonstration purposes.

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

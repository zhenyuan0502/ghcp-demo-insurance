# Backend Node.js

This is a Node.js implementation of the insurance backend API, providing the same functionality as the Python Flask backend.

## Features

- Express.js web framework
- Sequelize ORM with SQLite database
- CORS support for cross-origin requests
- Same API endpoints as Python backend:
  - `POST /api/quote` - Create a new quote
  - `GET /api/quotes` - Get all quotes
  - `GET /api/quote/:id` - Get specific quote
  - `PUT /api/quote/:id/status` - Update quote status
  - `PUT /api/quotes/:id/status` - Update quote status (alternative)
  - `GET /api/health` - Health check

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## Database

The application uses SQLite with the database file stored in `instance/insurance.db`. The database schema is automatically created when the server starts.

## Environment Variables

Create a `.env` file with:
```
PORT=5000
DATABASE_URL=instance/insurance.db
NODE_ENV=development
```
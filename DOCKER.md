# Insurance App - Docker Setup

This project contains a Flask backend and React frontend, both containerized with Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Individual Service Commands

### Backend Only
```bash
# Build backend image
docker build -t insurance-backend ./backend

# Run backend container
docker run -p 5000:5000 insurance-backend
```

### Frontend Only
```bash
# Build frontend image
docker build -t insurance-frontend ./frontend

# Run frontend container
docker run -p 3000:3000 insurance-frontend
```

## Docker Compose Commands

```bash
# Build and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database path (default: sqlite:///instance/insurance.db)
- `FLASK_ENV`: Flask environment (default: production)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml`
2. Consider using a production database (PostgreSQL, MySQL)
3. Set up reverse proxy (nginx) for SSL termination
4. Use Docker secrets for sensitive data

## Troubleshooting

### Common Issues

1. **Port conflicts:** Ensure ports 3000 and 5000 are available
2. **Database issues:** Delete the volume and restart: `docker-compose down -v && docker-compose up --build`
3. **Build failures:** Check Docker logs: `docker-compose logs [service-name]`

### Health Checks

Both services include health checks:
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000

### Data Persistence

The backend database is persisted using Docker volumes. Data will survive container restarts but can be reset with:
```bash
docker-compose down -v
```

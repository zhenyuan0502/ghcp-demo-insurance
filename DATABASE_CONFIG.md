# Database Configuration Guide - Vietnamese Insurance App

This project now supports both SQLite and PostgreSQL databases with Vietnamese localization and VND currency support.

## Configuration

### Environment Variables

Both backends (`backend-nodejs` and `backend-py`) use the following environment variables:

- `DATABASE_TYPE`: Set to `sqlite` or `postgresql` (default: `sqlite`)
- `SQLITE_DATABASE_URL`: SQLite database path (default: `sqlite:///insurance.db`)
- `POSTGRES_HOST`: PostgreSQL host (default: `localhost`)
- `POSTGRES_PORT`: PostgreSQL port (default: `5432`)
- `POSTGRES_DB`: PostgreSQL database name (default: `insurance_db`)
- `POSTGRES_USER`: PostgreSQL username (default: `insurance_user`)
- `POSTGRES_PASSWORD`: PostgreSQL password (default: `insurance_password`)

### Switching Database Types

1. **For SQLite** (default):
   ```bash
   # In backend-nodejs/.env or backend-py/.env
   DATABASE_TYPE=sqlite
   ```

2. **For PostgreSQL**:
   ```bash
   # In backend-nodejs/.env or backend-py/.env
   DATABASE_TYPE=postgresql
   ```

## Running the Application

### Local Development

#### SQLite Mode (Default)
```powershell
# Python backend
.\run-py-react.ps1

# Node.js backend
.\run-nodejs-react.ps1
```

#### PostgreSQL Mode
1. Start PostgreSQL:
   ```bash
   # Using Docker Compose
   docker-compose up postgres -d
   # OR for Python backend
   docker-compose -f docker-compose.python.yml up postgres -d
   ```

2. Update `.env` file:
   ```bash
   DATABASE_TYPE=postgresql
   ```

3. Run the application:
   ```powershell
   # Python backend
   .\run-py-react.ps1

   # Node.js backend
   .\run-nodejs-react.ps1
   ```

### Docker Compose

#### SQLite with Docker
```bash
# Node.js backend with SQLite
docker-compose -f docker-compose.sqlite.yml up

# Python backend with SQLite
docker-compose -f docker-compose.python.sqlite.yml up
```

#### PostgreSQL with Docker (Default)
```bash
# Node.js backend with PostgreSQL
docker-compose up

# Python backend with PostgreSQL
docker-compose -f docker-compose.python.yml up
```

## Database Files

### SQLite
- Database files are stored in `backend-*/instance/` directories
- Files are automatically created when the application starts

### PostgreSQL
- Database server runs in Docker container
- Initialization scripts in `database-postgres/init-scripts/`
- Data persisted in Docker volume `postgres_data`

## PostgreSQL Setup

The PostgreSQL setup includes:

### Docker Configuration
- `database-postgres/Dockerfile`: PostgreSQL container setup
- `database-postgres/init-scripts/01-init.sql`: Database initialization

### Default Credentials
- **Database**: `insurance_db`
- **Username**: `insurance_user`
- **Password**: `insurance_password`
- **Port**: `5432`

### Sample Data
The PostgreSQL initialization includes sample quotes data for testing.

## Troubleshooting

### PostgreSQL Connection Issues
1. Ensure PostgreSQL is running:
   ```bash
   docker-compose up postgres -d
   ```

2. Check PostgreSQL status:
   ```bash
   docker-compose ps postgres
   ```

3. View PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

### SQLite Issues
1. Ensure the `instance` directory exists in the backend folder
2. Check file permissions for the SQLite database file
3. Database file is automatically created if it doesn't exist

### PowerShell Scripts
The PowerShell scripts (`run-*.ps1`) now:
- Detect database type from `.env` files
- Check if PostgreSQL is running when `DATABASE_TYPE=postgresql`
- Provide helpful messages for setup issues
- Allow continuing with warnings if PostgreSQL is not available

## Migration Between Database Types

When switching from SQLite to PostgreSQL or vice versa:

1. **Export data** from the current database (if needed)
2. **Update** the `.env` file with the new `DATABASE_TYPE`
3. **Restart** the application
4. **Import data** to the new database (if needed)

Note: The table schemas are compatible between SQLite and PostgreSQL for this application.

## Vietnamese Localization Features

### Currency Support
- **Vietnamese Dong (VND)** currency throughout the application
- Premium calculations optimized for Vietnamese insurance market
- All monetary values stored as integers (no decimals for VND)
- Premium amounts rounded to nearest 1,000 VND

### Sample Data
- 10 Vietnamese users with authentic Vietnamese names
- Vietnamese phone number format (09xx-xxx-xxx)
- VND coverage amounts (800 million to 5 billion VND range)
- Realistic premium calculations for Vietnamese market

### Database Schema Updates
- `premium` field changed from DECIMAL(10,2) to BIGINT for VND support
- Vietnamese comments in SQL initialization scripts
- Sample data includes diverse Vietnamese insurance scenarios

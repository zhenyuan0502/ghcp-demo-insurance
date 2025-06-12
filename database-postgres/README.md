# PostgreSQL Database

This folder contains PostgreSQL database configuration and initialization scripts for the Vietnamese Insurance App.

## Files Structure

- `Dockerfile` - PostgreSQL container configuration
- `init-scripts/` - Database initialization scripts
  - `01-init.sql` - Creates tables, indexes, and Vietnamese sample data

## Database Configuration

- **Database Name**: `insurance_db`
- **Username**: `insurance_user`
- **Password**: `insurance_password`
- **Port**: `5432`

## Database Schema

### quote table
- `id` - Serial primary key
- `purchaser_name` - VARCHAR(100), optional purchaser name
- `insured_name` - VARCHAR(100), optional insured name
- `email` - VARCHAR(100), customer's email
- `phone` - VARCHAR(20), customer's phone number (Vietnamese format: 09xx-xxx-xxx)
- `insurance_type` - VARCHAR(20), type of insurance (life, auto, home, health)
- `coverage_amount` - VARCHAR(20), coverage amount in VND
- `age` - INTEGER, customer's age
- `premium` - DECIMAL(15,0), calculated premium in VND (no decimals)
- `status` - VARCHAR(20), quote status (pending, approved, rejected)
- `created_at` - TIMESTAMP, when the quote was created

## Vietnamese Context

### Currency
- All monetary values are in **Vietnamese Dong (VND)**
- Premium calculations rounded to nearest 1,000 VND
- Coverage amounts typically range from 800 million to 5 billion VND

### Sample Data
The database includes 10 Vietnamese users with:
- Vietnamese names (Nguyễn Văn An, Trần Thị Bình, etc.)
- Vietnamese phone numbers (09xx-xxx-xxx format)
- VND coverage amounts and premiums
- Mixed insurance types and statuses

## Usage

The PostgreSQL container is automatically built and started when using Docker Compose with the updated configurations. The initialization scripts will run automatically on first startup to create the database schema and insert Vietnamese sample data.

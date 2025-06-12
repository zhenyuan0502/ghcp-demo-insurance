FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=insurance_db
ENV POSTGRES_USER=insurance_user
ENV POSTGRES_PASSWORD=insurance_password

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create instance directory for SQLite database
RUN mkdir -p instance

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NODE_ENV=production

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Command to run the application
CMD ["npm", "start"]

# Use Node.js 18 alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up devDependencies after build
RUN npm prune --production

# Install serve to serve the built application
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]

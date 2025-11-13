# Frontend Dockerfile - Running Vite dev server
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S envai -u 1001

# Change ownership of the app directory
RUN chown -R envai:nodejs /app
USER envai

# Expose port (Vite dev server runs on 5173 by default)
EXPOSE 5173

# Start the application using Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

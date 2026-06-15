# Use Node.js LTS image on Alpine for a lightweight, secure container base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY app.js ./

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD [ "node", "app.js" ]

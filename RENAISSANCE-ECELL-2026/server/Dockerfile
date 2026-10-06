# Use the official Node.js 20 image (LTS)
FROM node:20-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's cache layers
# This ensures 'npm install' only runs if dependencies change
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 7000

# Run the app as a non-privileged user for security
USER node

# Start the application
CMD ["node", "server.js"]
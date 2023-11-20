# Stage 1: Build Node.js app
FROM node:18.18.2-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port for Node.js
EXPOSE 8001

# Define the command to run your application
CMD ["npm", "start","dev"]

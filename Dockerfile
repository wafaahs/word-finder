# Use official Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port Vite uses
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]

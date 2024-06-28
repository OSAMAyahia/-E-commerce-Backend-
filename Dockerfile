# Use the official Node.js image from the Docker Hub
FROM node:20

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app folder "." refer to /app
COPY package.json .

# Install the dependencies and npm is known to container because w install node 
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on

# Define the command to run the app
CMD [ "npm","run", "start" ]
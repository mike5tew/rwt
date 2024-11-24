# Stage 1: Build the React app
FROM node:14 AS build

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
# Step 1: Build the Frontend
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Create a temporary .env file for the build process
RUN echo "PORT=3000" > ../.env
RUN echo "VITE_API_URL=/api" >> ../.env

RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy our runtime configuration script
COPY generate-config.sh /docker-entrypoint.d/90-generate-config.sh
RUN chmod +x /docker-entrypoint.d/90-generate-config.sh

# Expose the port on which the app will run
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
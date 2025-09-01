# Stage 1: Compile and Build angular codebase
FROM node:22.18-alpine3.21 AS build

LABEL name="project-management-tool-front" \
    description="Front Angular Project Management Tool" 

# Set the working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate the build of the application (production par défaut)
RUN npm run build

# Stage 2: Serve app with nginx server
FROM nginx:1.29.0-alpine3.22

# Install bash for script execution
RUN apk update && apk add --no-cache \
    bash \
    && rm -rf /var/cache/apk/*

# Copy the build output to nginx html directory
# IMPORNTANT: the files Angular generates are in /browser with version 19
COPY --from=build /app/dist/project-management-tool-front/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard nginx port)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
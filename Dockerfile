# Production image: Serve pre-built Angular app with nginx
FROM nginx:1.29.0-alpine3.22

LABEL name="project-management-tool-front" \
  description="Front Angular Project Management Tool"

# Install bash for script execution
RUN apk update && apk add --no-cache \
  bash \
  && rm -rf /var/cache/apk/*

# Copy the pre-built Angular application to nginx html directory
# IMPORTANT: Run 'npm run build' locally before building this Docker image
# Angular 19+ outputs files in /browser subdirectory
COPY dist/project-management-tool-front/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard nginx port)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

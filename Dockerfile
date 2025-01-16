# Stage 1: Build (Node.js environment)
FROM node:18-bullseye-slim AS builder  

ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /app

# Set environment variables for Node
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Create necessary directories
RUN mkdir -p /app/src/assets/fonts

COPY package*.json ./
# Set npm configuration
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5 \
    && npm config set legacy-peer-deps true

# Install dependencies with specific npm config
RUN npm config set legacy-peer-deps true \
    && npm ci \
    && npm install @babel/plugin-proposal-private-property-in-object \
    && npm cache clean --force

COPY .env .

# Copy source files first
COPY . .

# Build with production settings
RUN npm run build || (echo "Build failed" && exit 1)

# Stage 2: Production (Nginx server)
FROM nginx:alpine AS production

VOLUME ["/app/build"]

# Configure nginx and create fonts directory
RUN mkdir -p /var/cache/nginx \
    && mkdir -p /usr/share/nginx/html/fonts \
    && chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx

# Copy built files and config
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/src/assets/fonts /usr/share/nginx/html/fonts
COPY ./combined.conf /etc/nginx/nginx.conf
RUN cat /etc/nginx/nginx.conf # Add this line to print the file contents

# Cleanup
RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
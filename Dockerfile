# Stage 1: Build (Node.js environment)
FROM node:18-bullseye-slim AS builder  

ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /app

# Copy build env first
COPY .env.build .env

# Set environment variables for Node
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Create necessary directories
RUN mkdir -p /app/src/assets/fonts

COPY package*.json ./
# Configure npm
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5 \
    && npm config set legacy-peer-deps true

# Install dependencies
RUN set -x \
    && echo "Available disk space before npm install:" \
    && df -h /tmp /var/cache /app \
    && npm ci --no-optional --prefer-offline \
    && npm install @babel/plugin-proposal-private-property-in-object \
    && npm cache clean --force \
    && rm -rf /tmp/* /var/cache/* /root/.npm/*

COPY .env .
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production (Nginx server)
FROM nginx:1.25-bookworm AS production

# Install required tools
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y --no-install-recommends \
    bash \
    dos2unix \
    wget \
    curl \
    netcat-openbsd \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/src/assets/fonts /usr/share/nginx/html/fonts

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R u=rwX,go=rX /usr/share/nginx/html

# Copy nginx configuration template
COPY ./nginx/default.conf.template /etc/nginx/templates/

# Verify template was copied correctly
RUN if [ ! -f /etc/nginx/templates/default.conf.template ]; then \
        echo "ERROR: Template file not found!" >&2; \
        exit 1; \
    fi

# Create SSL directory structure (without generating self-signed certs)
RUN mkdir -p /etc/nginx/ssl && \
    chown nginx:nginx /etc/nginx/ssl && \
    chmod 710 /etc/nginx/ssl

# Copy helper scripts
COPY ./wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY ./start-nginx.sh /usr/local/bin/

# Set executable permissions
RUN chmod +x /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/start-nginx.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health.txt || exit 1

EXPOSE 80 443

CMD ["/usr/local/bin/start-nginx.sh"]
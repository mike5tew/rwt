#!/bin/bash
set -e

# Perform environment variable substitution
envsubst '${NGINX_BACKEND_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify the configuration
echo "--- Generated Nginx Configuration ---"
cat /etc/nginx/conf.d/default.conf
echo "--- End of Configuration ---"

# Test Nginx config
nginx -t

# Start Nginx
exec nginx -g "daemon off;"

#!/bin/bash

# Verify SSL files exist before starting
if [ ! -f "$SSL_CERT_FILE" ] || [ ! -f "$SSL_KEY_FILE" ]; then
  echo "ERROR: SSL files missing!"
  echo "Cert path: $SSL_CERT_FILE"
  echo "Key path: $SSL_KEY_FILE"
  exit 1
fi

nginx -t || exit 1
exec nginx -g "daemon off;"
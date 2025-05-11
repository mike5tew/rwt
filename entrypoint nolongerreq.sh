#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.
set -x # Print commands and their arguments as they are executed.

echo "Entrypoint: Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
  echo "Entrypoint: Nginx configuration test failed. Exiting." >&2
  exit 1
fi
echo "Entrypoint: Nginx configuration test passed."

# Explicitly test nc command
echo "Entrypoint: Directly testing API connection with 'nc -z rwtproj-api 8080'"
if nc -z rwtproj-api 8080; then
  echo "Entrypoint: Direct 'nc -z' test SUCCEEDED."
else
  echo "Entrypoint: Direct 'nc -z' test FAILED with status $?."
fi

# Execute wait-for-it.sh
WAIT_TARGET="rwtproj-api:8080"
WAIT_TIMEOUT=30
NGINX_CMD=(nginx -g 'daemon off;') # Define nginx command as an array

echo "Entrypoint: Waiting for API service ($WAIT_TARGET) with timeout ${WAIT_TIMEOUT}s..."
# Run wait-for-it without exec first to check its exit code
# Pass a simple echo command to wait-for-it
/usr/local/bin/wait-for-it.sh "$WAIT_TARGET" -t "$WAIT_TIMEOUT" -- echo "Entrypoint: API check successful via wait-for-it."
wait_status=$?

if [ $wait_status -eq 0 ]; then
  echo "Entrypoint: wait-for-it.sh succeeded. Preparing to start Nginx."
  echo "Entrypoint: Executing command: ${NGINX_CMD[@]}"
  # Now exec nginx using the array
  exec "${NGINX_CMD[@]}"
else
  echo "Entrypoint: wait-for-it.sh failed with status $wait_status. Nginx will not start." >&2
  exit $wait_status
fi


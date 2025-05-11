#!/usr/bin/env bash
# wait-for-it.sh - Wait for a service to be available
set -e

# Get host:port from first argument or use defaults
HOST=$(echo "${1:-api:8080}" | cut -d':' -f1)
PORT=$(echo "${1:-api:8080}" | cut -d':' -f2)
TIMEOUT=${3:-30}

echo "Waiting for $HOST:$PORT to be available..."
timeout=$TIMEOUT
while ! nc -z -w1 "$HOST" "$PORT" >/dev/null 2>&1; do
    timeout=$((timeout - 1))
    if [ $timeout -eq 0 ]; then
        echo "Timeout reached waiting for $HOST:$PORT"
        if [ "$5" == "--strict" ]; then
            exit 1
        fi
        break
    fi
    sleep 1
done

echo "$HOST:$PORT is available, continuing..."
# If there's a command to execute after the wait
if [ "$5" == "--strict" ] && [ "$6" == "--" ]; then
    shift 6
    exec "$@"
elif [ "$5" == "--" ]; then
    shift 5
    exec "$@"
fi

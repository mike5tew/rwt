#!/bin/bash
set -euo pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TEMPLATE_PATH="${SCRIPT_DIR}/nginx/default.conf.template"

IMAGE_NAME="m1ke57ew/espthinking-frontend"
BUILD_DATE=$(date +%s)
TIMESTAMP_TAG="${IMAGE_NAME}:${BUILD_DATE}"
LATEST_TAG="${IMAGE_NAME}:latest"

echo "Starting build process for ${IMAGE_NAME}..."

# Enhanced cleanup
if [ "${1:-}" == "--clean" ]; then
    echo "Performing deep cleanup..."
    docker builder prune -af
    docker system prune -af
fi

# --- Verification Steps ---
echo "Verifying configuration files:"
# Check for nginx template existence relative to the script directory
if [ ! -f "${TEMPLATE_PATH}" ]; then
    echo "ERROR: default.conf.template not found at ${TEMPLATE_PATH}"
    exit 1
fi

# Check for SSL config within the *actual* template
if grep -q "ssl_certificate" "${TEMPLATE_PATH}"; then
    echo "✓ SSL configuration found in nginx template"
else
    echo "ERROR: Missing SSL configuration in nginx template at ${TEMPLATE_PATH}"
    exit 1
fi

# Check for wait-for-it.sh script relative to script dir
WAIT_FOR_IT_PATH="${SCRIPT_DIR}/wait-for-it.sh"
if [ ! -f "${WAIT_FOR_IT_PATH}" ]; then
    echo "WARNING: wait-for-it.sh not found at ${WAIT_FOR_IT_PATH}, downloading..."
    curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh > "${WAIT_FOR_IT_PATH}"
    chmod +x "${WAIT_FOR_IT_PATH}"
    echo "✓ wait-for-it.sh downloaded"
fi

# Check Dockerfile for retry logic
if grep -q "Acquire::Retries" Dockerfile; then
    echo "✓ Package retry logic found in Dockerfile"
else
    echo "WARNING: No package retry logic in Dockerfile"
fi

export DOCKER_BUILDKIT=1
export BUILDKIT_INLINE_CACHE=1

# --- Build with Robust Retries ---
MAX_RETRIES=3
retry_count=0

echo "Building Docker image (with up to ${MAX_RETRIES} retries)..."
until docker build --platform linux/amd64 \
    --no-cache \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -t ${LATEST_TAG} \
    -t ${TIMESTAMP_TAG} "${SCRIPT_DIR}" || ((retry_count++ >= MAX_RETRIES))
do
    echo "Build failed, retry ${retry_count}/${MAX_RETRIES}..."
    sleep $((retry_count * 2))
done

if [ $retry_count -ge $MAX_RETRIES ]; then
    echo "ERROR: Build failed after ${MAX_RETRIES} attempts"
    exit 1
fi

# --- Push with Verification ---
push_image() {
    local tag=$1
    for i in {1..3}; do
        if docker push ${tag}; then
            return 0
        fi
        echo "Push attempt ${i} failed for ${tag}, retrying..."
        sleep $i
    done
    return 1
}

echo "Pushing images..."
push_image ${TIMESTAMP_TAG} || {
    echo "ERROR: Failed to push ${TIMESTAMP_TAG}"
    exit 1
}

push_image ${LATEST_TAG} || {
    echo "ERROR: Failed to push ${LATEST_TAG}"
    exit 1
}

echo "Build and push successful!"
echo "Timestamped image: ${TIMESTAMP_TAG}"
echo "Latest image: ${LATEST_TAG}"
#!/bin/bash

echo "====== Disk Space Diagnostics ======"
echo "Running this on your build machine or inside a container will help diagnose space issues"

echo -e "\n=== Current Disk Usage ==="
df -h

echo -e "\n=== Docker System Information ==="
docker system df -v

echo -e "\n=== Docker Images ==="
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo -e "\n=== Largest Directories ==="
du -h --max-depth=1 / 2>/dev/null | sort -hr | head -10

echo -e "\n=== Docker Build Space ==="
echo "If building with Docker Desktop, check the Resources settings"
echo "Current Docker Desktop disk image size may need to be increased"
echo "Recommendation: Increase Docker Desktop disk image size to at least 60GB"

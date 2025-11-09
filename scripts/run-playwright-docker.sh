#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="udp-playwright"
DOCKERFILE="Dockerfile.playwright"

echo "Building Docker image $IMAGE_NAME..."
docker build -f "$DOCKERFILE" -t "$IMAGE_NAME" .

echo "Running Playwright tests inside container (will use host networking so container can reach localhost)..."
echo "If you prefer not to use host networking, adjust the --network flag and pass API host via env."

# Use host networking so the container can reach services on the host (e.g., API at localhost:3030)
docker run --rm --network=host -e CI=true "$IMAGE_NAME"

#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CONTAINER_NAME="udp-test-db"

if ! command -v docker &> /dev/null; then
  echo "❌ docker is required. Install Docker and re-run this script."
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo -e "${GREEN}🧹 Stopping and removing container: ${CONTAINER_NAME}${NC}"
  docker rm -f "${CONTAINER_NAME}" || true
  echo -e "${GREEN}✅ Removed ${CONTAINER_NAME}${NC}"
else
  echo -e "${YELLOW}ℹ️  Container ${CONTAINER_NAME} not found; nothing to remove.${NC}"
fi

exit 0

#!/usr/bin/env bash
set -euo pipefail

# Setup a local PostgreSQL container for running tests and apply the schema.
# Usage: ./scripts/setup-test-db.sh
#
# Notes:
# - This script determines the repository root based on its location and runs
#   pnpm commands from the package folders so callers don't need to worry
#   about relative -C paths. If you prefer to run seed manually, from the
#   repository root run: `pnpm -C apps/web db:seed`.

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🏗️  Starting test PostgreSQL container (udp-test-db)...${NC}"

if ! command -v docker &> /dev/null; then
  echo "❌ docker is required. Install Docker and re-run this script."
  exit 1
fi

CONTAINER_NAME="udp-test-db"
IMAGE="postgres:16-alpine"
HOST_PORT=5433
DB_NAME="udp_test"
DB_USER="postgres"
DB_PASSWORD="postgres"

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Container '${CONTAINER_NAME}' already exists. Starting it..."
  docker start "${CONTAINER_NAME}"
else
  docker run --name "${CONTAINER_NAME}" \
    -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -p ${HOST_PORT}:5432 \
    -d "${IMAGE}"
fi

echo -e "${GREEN}✅ PostgreSQL container started (listening on localhost:${HOST_PORT})${NC}"

echo -e "${GREEN}⏳ Waiting for PostgreSQL to become ready (timeout: 60s)...${NC}"

MAX_WAIT=60
WAITED=0
until docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" > /dev/null 2>&1; do
  sleep 1
  WAITED=$((WAITED+1))
  if [ ${WAITED} -ge ${MAX_WAIT} ]; then
    echo -e "${YELLOW}⚠️  Timed out waiting for PostgreSQL to be ready.${NC}"
    echo "Check container logs: docker logs ${CONTAINER_NAME}"
    exit 1
  fi
done

echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

# Source test env file if present and export variables so child processes see them
if [ -f .env.test ]; then
  echo -e "${GREEN}📝 Loading .env.test into environment${NC}"
  set -a
  # shellcheck disable=SC1090
  source .env.test
  set +a
else
  echo -e "${YELLOW}⚠️  .env.test not found in repo root. Falling back to default DATABASE_URL.${NC}"
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${HOST_PORT}/${DB_NAME}"
fi

echo -e "${GREEN}📦 Applying Prisma schema (db push)...${NC}"

# Run prisma db push from the packages/db context using the canonical schema
if command -v pnpm &> /dev/null; then
  # Resolve repo root (script lives in <repo>/scripts)
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

  echo -e "${GREEN}🛠️  Repo root detected at: ${REPO_ROOT}${NC}"

  echo -e "${GREEN}📦 Applying Prisma schema (from packages/db) using pnpm workspace filter...${NC}"
  # Run from repo root using pnpm workspace filtering so commands succeed regardless of caller cwd
  (cd "${REPO_ROOT}" && pnpm --reporter=silent --filter ./packages/db exec prisma db push --schema "${REPO_ROOT}/apps/api/prisma/schema.prisma")
  echo -e "${GREEN}🌱 Prisma schema applied${NC}"

  # Attempt to run seed from apps/web if available using workspace filter
  if [ -f "${REPO_ROOT}/apps/web/package.json" ] && grep -q '"db:seed"' "${REPO_ROOT}/apps/web/package.json" 2>/dev/null; then
    echo -e "${GREEN}🌱 Seeding database with demo data (apps/web db:seed) using pnpm filter${NC}"
  (cd "${REPO_ROOT}" && pnpm --reporter=silent --filter ./apps/web db:seed) || echo -e "${YELLOW}⚠️  db:seed failed or is not configured${NC}"
  else
    echo -e "${YELLOW}⚠️  No db:seed script found in apps/web; skipping seeding.${NC}"
    echo "If you want to seed manually, from repo root run: pnpm --filter ./apps/web db:seed"
  fi
else
  echo -e "${YELLOW}⚠️  pnpm not found. Please run the following commands manually:${NC}"
  echo "  cd packages/db"
  echo "  DATABASE_URL=\"postgresql://postgres:postgres@localhost:5433/udp_test\" pnpm exec prisma db push --schema ../../apps/api/prisma/schema.prisma"
fi

echo -e "${GREEN}✅ Test DB setup complete.${NC}"
echo "You can now run your tests against DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5433/udp_test}"

exit 0

#!/bin/bash
# Setup script for WebSocket server - Local PostgreSQL with Docker

set -e

echo "🚀 Setting up WebSocket Server Environment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# 2. Start PostgreSQL container
echo ""
echo "📦 Starting PostgreSQL container..."
if docker ps -a | grep -q udp-postgres; then
    echo "Container 'udp-postgres' already exists. Starting it..."
    docker start udp-postgres
else
    docker run --name udp-postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=udp_dev \
      -p 5432:5432 \
      -d postgres:16-alpine
fi

echo -e "${GREEN}✅ PostgreSQL is running on localhost:5432${NC}"

# 3. Wait for PostgreSQL to be ready
echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# 4. Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/udp_dev"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional - get from GitHub/Google)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"

# WebSocket Server
NEXT_PUBLIC_WS_URL="ws://localhost:3030"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

# 5. Install dependencies (if pnpm is available)
if command -v pnpm &> /dev/null; then
    echo ""
    echo "📦 Installing dependencies..."
    pnpm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  pnpm not found. Please run 'pnpm install' manually${NC}"
fi

# 6. Set up database
echo ""
echo "🗄️  Setting up database schema..."
cd packages/db
if command -v pnpm &> /dev/null; then
    pnpm db:push
    echo ""
    echo "🌱 Seeding database with demo data..."
    pnpm db:seed
    echo -e "${GREEN}✅ Database is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Please run the following commands manually:${NC}"
    echo "   cd packages/db"
    echo "   pnpm db:push"
    echo "   pnpm db:seed"
fi
cd ../..

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up OAuth credentials (optional):"
echo "   - GitHub: https://github.com/settings/developers"
echo "   - Google: https://console.cloud.google.com/apis/credentials"
echo ""
echo "2. Start the WebSocket server:"
echo "   cd apps/api"
echo "   pnpm dev"
echo ""
echo "3. In another terminal, start the web app:"
echo "   cd apps/web"
echo "   pnpm dev"
echo ""
echo "4. Open http://localhost:3000"
echo ""
echo "📚 For more info, see docs/websocket-integration.md"

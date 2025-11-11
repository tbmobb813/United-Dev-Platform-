# WebSocket Server Setup Guide

Complete guide to setting up the United Dev Platform WebSocket server. Choose the method that works best for you!

## 🎯 Quick Start (3 Options)

### Option 1: Local Development (Recommended) 🚀

**What you need:**
- Node.js 18+
- pnpm
- Docker (for PostgreSQL only)

**Setup steps:**

```bash
# 1. Make setup script executable
chmod +x scripts/setup-local.sh

# 2. Run the setup script
./scripts/setup-local.sh

# 3. Start the WebSocket server
cd apps/api
pnpm dev

# 4. In another terminal, start the web app
cd apps/web
pnpm dev

# 5. Open http://localhost:3000
```

That's it! The script automatically:
- ✅ Starts PostgreSQL in Docker
- ✅ Creates `.env` file
- ✅ Installs dependencies
- ✅ Sets up database schema
- ✅ Seeds demo data

---

### Option 2: Docker Compose (Everything Containerized) 🐳

**What you need:**
- Docker
- Docker Compose

**Setup steps:**

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env with your values (at minimum, set NEXTAUTH_SECRET)
nano .env

# 3. Start all services
docker-compose up -d

# 4. Run database migrations
docker-compose exec api pnpm --filter @udp/db db:push

# 5. Seed database (optional)
docker-compose exec api pnpm --filter @udp/db db:seed

# 6. Open http://localhost:3000
```

**Services running:**
- Web app: http://localhost:3000
- WebSocket server: ws://localhost:3030
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

### Option 3: Supabase (Managed PostgreSQL) ☁️

**What you need:**
- Node.js 18+
- pnpm
- Supabase account (free tier available)

**Setup steps:**

```bash
# 1. Create a Supabase project at https://supabase.com

# 2. Get your database connection string
# Go to: Settings > Database > Connection String (URI)

# 3. Create .env file
cat > .env << 'EOF'
# Supabase Database (use "Connection Pooling" URL for better performance)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# WebSocket Server
NEXT_PUBLIC_WS_URL="ws://localhost:3030"
NODE_ENV="development"
EOF

# 4. Install dependencies
pnpm install

# 5. Push database schema to Supabase
cd packages/db
pnpm db:push

# 6. Seed demo data
pnpm db:seed
cd ../..

# 7. Start WebSocket server
cd apps/api
pnpm dev &

# 8. Start web app
cd apps/web
pnpm dev

# 9. Open http://localhost:3000
```

---

## 📋 Environment Variables

### Required Variables

```env
# Database URL (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# NextAuth URL
NEXTAUTH_URL="http://localhost:3000"

# WebSocket Server URL (for client connections)
NEXT_PUBLIC_WS_URL="ws://localhost:3030"
```

### Optional OAuth Variables

```env
# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### How to Get OAuth Credentials

#### GitHub OAuth:
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. **Application name:** United Dev Platform
4. **Homepage URL:** `http://localhost:3000`
5. **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
6. Copy Client ID and generate Client Secret

#### Google OAuth:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create new project or select existing
3. Create OAuth 2.0 Client ID
4. **Application type:** Web application
5. **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

---

## 🗄️ Database Setup Details

### Using Docker PostgreSQL (Local)

```bash
# Start PostgreSQL
docker run --name udp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=udp_dev \
  -p 5432:5432 \
  -d postgres:16-alpine

# Connection string:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/udp_dev"
```

### Using Supabase

1. **Create project** at https://supabase.com/dashboard
2. **Get connection string:**
   - Go to Settings → Database
   - Copy "Connection Pooling" string (recommended)
   - Or copy "Connection String" (direct connection)

**Why Supabase?**
- ✅ Free tier (500MB database, 2GB bandwidth)
- ✅ Managed PostgreSQL (no Docker needed)
- ✅ Built-in dashboard and SQL editor
- ✅ Automatic backups
- ✅ Real-time subscriptions (optional)
- ✅ Connection pooling for better performance

### Push Schema to Database

```bash
cd packages/db

# Push schema (creates tables)
pnpm db:push

# Or run migrations (recommended for production)
pnpm db:migrate

# Seed demo data
pnpm db:seed

# Open Prisma Studio to view data
pnpm db:studio
```

---

## 🧪 Testing Your Setup

### 1. Check PostgreSQL Connection

```bash
# If using Docker:
docker exec -it udp-postgres psql -U postgres -d udp_dev -c "\dt"

# If using Supabase:
# Go to Supabase Dashboard → SQL Editor → Run:
# SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see tables like: `User`, `Project`, `CollaborativeSession`, `UserPresence`, etc.

### 2. Test WebSocket Server

```bash
# Start the server
cd apps/api
pnpm dev

# In another terminal, test the health endpoint
curl http://localhost:3030/health

# Expected response:
# {"ok":true,"timestamp":"2025-...","env":"development"}
```

### 3. Test Full Stack

```bash
# Start both servers
cd apps/api && pnpm dev &
cd apps/web && pnpm dev &

# Open browser
open http://localhost:3000

# You should see:
# - Login page (if not signed in)
# - Editor page (after sign in)
# - Active users list
# - Real-time collaboration
```

### 4. Run Tests

```bash
# Unit tests (no server needed)
cd apps/api
pnpm test:unit

# Integration tests (server must be running)
pnpm dev &
pnpm test:integration
```

---

## 🐛 Troubleshooting

### Issue: "Port 5432 already in use"

**Solution:** Another PostgreSQL instance is running

```bash
# Stop existing PostgreSQL
docker ps  # Find container ID
docker stop <container-id>

# Or use a different port
docker run --name udp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=udp_dev \
  -p 5433:5432 \  # Changed to 5433
  -d postgres:16-alpine

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/udp_dev"
```

### Issue: "WebSocket connection failed"

**Possible causes:**
1. WebSocket server not running
2. Wrong URL in .env
3. Port 3030 in use

**Solution:**

```bash
# Check if server is running
curl http://localhost:3030/health

# Check if port is in use
lsof -i :3030

# Verify .env has correct URL
cat .env | grep NEXT_PUBLIC_WS_URL
# Should be: NEXT_PUBLIC_WS_URL="ws://localhost:3030"
```

### Issue: "Prisma Client not generated"

**Solution:**

```bash
cd packages/db
pnpm generate
```

### Issue: "OAuth sign in not working"

**Possible causes:**
1. Invalid client ID/secret
2. Wrong callback URL
3. NEXTAUTH_SECRET not set

**Solution:**

```bash
# 1. Verify OAuth credentials in .env
cat .env | grep GITHUB

# 2. Generate new NEXTAUTH_SECRET
openssl rand -base64 32

# 3. Check callback URLs match:
# GitHub: http://localhost:3000/api/auth/callback/github
# Google: http://localhost:3000/api/auth/callback/google
```

### Issue: "Database connection failed"

**Solution:**

```bash
# Test connection
cd packages/db
pnpm prisma db pull

# If using Docker, check container is running
docker ps | grep postgres

# If using Supabase, check:
# 1. Project is not paused
# 2. Connection string is correct
# 3. Password doesn't contain special characters (URL encode if needed)
```

---

## 📊 Architecture Overview

```
┌─────────────────┐         HTTP/WS          ┌──────────────────┐
│                 │  ←────────────────────→   │                  │
│  Web Browser    │     (localhost:3000)      │   Next.js App    │
│  (Client)       │                           │   (apps/web)     │
└─────────────────┘                           └──────────────────┘
                                                       │
                                                       │ HTTP
                                                       ▼
┌─────────────────┐                           ┌──────────────────┐
│                 │   WebSocket (port 3030)   │                  │
│  Yjs Provider   │  ←────────────────────→   │  WebSocket API   │
│  (y-websocket)  │                           │  (apps/api)      │
└─────────────────┘                           └──────────────────┘
                                                       │
                                                       │ SQL
                                                       ▼
                                              ┌──────────────────┐
                                              │   PostgreSQL     │
                                              │   (Database)     │
                                              │                  │
                                              │  - Docker/Local  │
                                              │  - Supabase      │
                                              └──────────────────┘
```

---

## 🚀 Production Deployment

### Prerequisites

- PostgreSQL database (managed service recommended)
- Node.js hosting (Vercel, Railway, Fly.io, etc.)
- Domain name with SSL certificate

### Environment Variables (Production)

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@production-db:5432/db"
NEXTAUTH_SECRET="generate-strong-secret-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_WS_URL="wss://api.yourdomain.com"  # Note: wss:// for SSL
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Deployment Options

#### Option A: Vercel (Web) + Railway (API)

**Web App (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel

# Set environment variables in Vercel dashboard
```

**API Server (Railway):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd apps/api
railway up

# Set environment variables in Railway dashboard
```

#### Option B: Docker + Cloud VM

```bash
# Build and deploy with Docker Compose
docker-compose -f docker-compose.production.yml up -d
```

### Database Migration (Production)

```bash
cd packages/db

# Run migrations (don't use db:push in production)
pnpm db:migrate:deploy

# Optionally seed data
pnpm db:seed
```

---

## 📚 Additional Resources

- [WebSocket Integration Guide](docs/websocket-integration.md)
- [Backend Implementation Guide](docs/backend-implementation.md)
- [API Testing Guide](apps/api/__tests__/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Yjs Documentation](https://docs.yjs.dev)

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the logs: `docker-compose logs api` or check terminal output
3. Search existing issues: https://github.com/your-repo/issues
4. Open a new issue with:
   - What you tried
   - Error messages
   - Environment details (OS, Node version, etc.)

---

## ✅ Setup Checklist

- [ ] PostgreSQL is running (Docker or Supabase)
- [ ] `.env` file created with all required variables
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database schema pushed (`pnpm db:push`)
- [ ] Demo data seeded (`pnpm db:seed`)
- [ ] WebSocket server starts (`pnpm dev`)
- [ ] Web app starts (`pnpm dev`)
- [ ] Can access http://localhost:3000
- [ ] OAuth providers configured (optional)
- [ ] Tests pass (`pnpm test:unit`)

🎉 **Ready to collaborate in real-time!**

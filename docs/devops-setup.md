# DevOps Setup Guide

## Overview

This document outlines the complete DevOps foundation for the United Dev
Platform, including development environment setup, code quality standards,
deployment configurations, and operational procedures.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment](#development-environment)
- [Code Quality & Standards](#code-quality--standards)
- [Environment Configuration](#environment-configuration)
- [Docker & Containerization](#docker--containerization)
- [Deployment](#deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Software

- **Node.js 20+**: Latest LTS version
- **pnpm**: Package manager (install via `corepack enable`)
- **Docker & Docker Compose**: For containerized development and deployment
- **Git**: Version control
- **VS Code**: Recommended editor with workspace configuration

### System Setup

```bash
# Enable corepack for pnpm
corepack enable

# Install pnpm globally
corepack prepare pnpm@latest --activate

# Verify installation
node --version  # Should be 20+
pnpm --version  # Should be latest
docker --version
```

## Development Environment

### Initial Setup

1. **Clone and Setup**

```bash
git clone <repository-url>
cd United-Dev-Platform-
pnpm install
```

2. **Environment Configuration**

```bash
# Copy environment templates
cp .env.example .env.development
cp .env.example .env.production

# Edit environment files with your settings
```

3. **Validate Setup**

```bash
# Validate environment configuration
pnpm validate-env

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

### VS Code Workspace

The repository includes a comprehensive VS Code workspace configuration:

- **Automatic Formatting**: ESLint + Prettier on save
- **Debugging Profiles**: Web, API, and mobile debugging
- **Task Automation**: Build, test, and development tasks
- **Extension Recommendations**: All necessary extensions for development

### Development Scripts

```bash
# Development
pnpm dev                 # Start all services
pnpm dev:web            # Start web app only
pnpm dev:api            # Start API only
pnpm dev:mobile         # Start mobile app

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix          # Fix ESLint issues
pnpm format            # Format with Prettier
pnpm type-check        # TypeScript type checking

# Validation
pnpm check             # Run all checks (lint + type + test)
pnpm validate-env      # Validate environment variables
pnpm test              # Run tests

# Maintenance
pnpm clean             # Clean build artifacts
pnpm reset             # Clean and reinstall
```

## Code Quality & Standards

### ESLint Configuration

Shared ESLint configuration across the monorepo:

- **React Rules**: React-specific linting
- **TypeScript Rules**: Type-safe coding standards
- **Next.js Rules**: Next.js best practices
- **React Native Rules**: Mobile-specific standards

### Prettier Configuration

Consistent code formatting:

- 2-space indentation
- Single quotes
- Trailing commas
- Semicolons required

### Pre-commit Hooks

Environment validation runs before builds:

```bash
# Automatic validation before build
pnpm prebuild  # Runs check + validate-env
```

## Environment Configuration

### Environment Variables

#### Required Variables

**Development:**

- `NODE_ENV=development`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_VERSION`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

**Production:**

- All development variables +
- `NEXTAUTH_SECRET`
- `DATABASE_URL`

#### Optional Variables

- `OPENAI_API_KEY`: OpenAI integration
- `ANTHROPIC_API_KEY`: Anthropic integration
- `GITHUB_CLIENT_ID/SECRET`: GitHub OAuth
- `ALLOW_LOCAL_MODELS`: Local AI models
- `DEBUG`: Debug mode
- `ENABLE_TELEMETRY`: Analytics

### Environment Files

- `.env.development`: Development configuration
- `.env.production`: Production configuration
- `.env.example`: Template with all variables
- `mobile/.env.development`: Mobile-specific settings
- `web/.env.example`: Web-specific settings

### Validation

```bash
# Validate current environment
pnpm validate-env

# Environment validation runs automatically in:
# - prebuild script
# - CI/CD pipeline
# - Container startup
```

## Docker & Containerization

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Services:
# - web-dev: http://localhost:3000
# - api-dev: http://localhost:3001
# - postgres-dev: localhost:5433
# - redis-dev: localhost:6380
```

### Production

```bash
# Build and start production environment
docker-compose up --build

# Services:
# - web: http://localhost:3000
# - api: http://localhost:3001
# - postgres: localhost:5432
# - redis: localhost:6379
# - nginx: http://localhost:80
```

### Docker Images

- **Multi-stage builds**: Optimized for production
- **Alpine base**: Minimal image size
- **Build caching**: Efficient rebuilds
- **Health checks**: Container monitoring

## Deployment

### Local Development

```bash
# Start all services in development mode
pnpm dev:all

# Or start individual services
pnpm dev:web     # Next.js web app
pnpm dev:api     # Node.js API
pnpm dev:mobile  # React Native app
```

### Docker Development

```bash
# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Production simulation
docker-compose up --build
```

### Production Deployment

1. **Environment Setup**

```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export NEXTAUTH_SECRET=...
```

2. **Build and Deploy**

```bash
# Build all applications
pnpm build

# Start with Docker Compose
docker-compose up -d

# Or deploy individual services
```

3. **Health Checks**

```bash
# Verify services
curl http://localhost/health
curl http://localhost:3000/api/health
```

### Database Setup

The database initializes automatically with:

- User management tables
- Project and collaboration tables
- File storage tables
- AI conversation tables
- Proper indexes and triggers

## Monitoring & Maintenance

### Health Checks

- **Nginx Health**: `http://localhost:8080/health`
- **API Health**: `http://localhost:3001/api/health`
- **Web Health**: `http://localhost:3000/api/health`

### Logs

```bash
# View service logs
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f postgres

# Application logs
pnpm dev:web    # Web app logs
pnpm dev:api    # API logs
```

### Maintenance

```bash
# Update dependencies
pnpm update

# Clean and rebuild
pnpm reset

# Database maintenance
docker-compose exec postgres psql -U postgres -d udp_db

# Redis maintenance
docker-compose exec redis redis-cli
```

### Backup & Recovery

```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres udp_db > backup.sql

# Redis backup
docker-compose exec redis redis-cli BGSAVE

# Restore database
docker-compose exec -T postgres psql -U postgres udp_db < backup.sql
```

## Security Considerations

### Environment Security

- Never commit `.env` files
- Use strong secrets in production
- Rotate API keys regularly
- Use environment-specific configurations

### Container Security

- Non-root user in containers
- Security headers in Nginx
- Regular base image updates
- Minimal attack surface

### Application Security

- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## Troubleshooting

### Common Issues

1. **pnpm Installation Issues**

```bash
# Enable corepack if not available
corepack enable
corepack prepare pnpm@latest --activate
```

2. **Environment Variable Issues**

```bash
# Validate environment
pnpm validate-env

# Check missing variables
cat .env.example
```

3. **Docker Issues**

```bash
# Clean Docker environment
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

4. **Port Conflicts**

```bash
# Check port usage
netstat -an | findstr :3000
netstat -an | findstr :3001

# Use different ports if needed
```

### Getting Help

- Check VS Code problems panel for TypeScript/ESLint issues
- Review Docker Compose logs for container issues
- Run `pnpm validate-env` for environment problems
- Check network connectivity for API issues

## Next Steps

1. **CI/CD Pipeline**: Set up GitHub Actions for automated testing and
   deployment
2. **Monitoring**: Implement application performance monitoring
3. **Scaling**: Configure horizontal scaling for production
4. **Security**: Implement additional security measures and auditing

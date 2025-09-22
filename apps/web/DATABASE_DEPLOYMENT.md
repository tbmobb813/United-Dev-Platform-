# Database Deployment & Migration Guide

## Development Setup

### Option 1: Local PostgreSQL with Docker

1. **Start the database:**
   ```bash
   cd apps/web
   docker-compose up -d
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate client:**
   ```bash
   npx prisma generate
   ```

### Option 2: Prisma Development Database

1. **Start Prisma dev server:**
   ```bash
   npx prisma dev
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

## Production Deployment

### Database Preparation

1. **Set up PostgreSQL instance** (choose one):
   - AWS RDS PostgreSQL
   - Google Cloud SQL PostgreSQL
   - Azure Database for PostgreSQL
   - Supabase
   - Railway
   - Vercel Postgres

2. **Configure environment variables:**
   ```bash
   DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-domain.com"
   GITHUB_CLIENT_ID="your-github-oauth-id"
   GITHUB_CLIENT_SECRET="your-github-oauth-secret"
   ```

### Deployment Scripts

#### 1. Production Database Setup
```bash
# Deploy to production database
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

#### 2. Seed Database (Optional)
```bash
# Run seed script if needed
npx prisma db seed
```

### Migration Management

#### Creating New Migrations
```bash
# After schema changes
npx prisma migrate dev --name describe_your_changes

# For production deployment
npx prisma migrate deploy
```

#### Reset Database (Development Only)
```bash
# Reset and re-migrate
npx prisma migrate reset
```

### Database Backup & Restore

#### Backup
```bash
# Backup production database
pg_dump $DATABASE_URL > backup.sql
```

#### Restore
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Environment Configuration

### Development (.env.local)
```bash
DATABASE_URL="postgresql://udp_user:udp_password@localhost:5432/unified_dev_platform?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"
```

### Production (.env.production)
```bash
DATABASE_URL="postgresql://user:pass@prod-host:5432/database"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="secure-production-secret"
GITHUB_CLIENT_ID="prod-github-client-id"
GITHUB_CLIENT_SECRET="prod-github-client-secret"
```

## Deployment Platforms

### Vercel Deployment
1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - migrations will run automatically

### Railway Deployment
1. **Create PostgreSQL service**
2. **Deploy application** with environment variables
3. **Run migrations** via Railway CLI

### Docker Deployment
1. **Build container:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Run with docker-compose:**
   ```yaml
   services:
     app:
       build: .
       depends_on:
         - postgres
       environment:
         DATABASE_URL: postgresql://user:pass@postgres:5432/db
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: unified_dev_platform
   ```

## Monitoring & Maintenance

### Database Health Checks
```bash
# Check database connection
npx prisma db push --preview-feature

# View database status
npx prisma studio
```

### Performance Monitoring
- Enable PostgreSQL slow query log
- Monitor connection pool usage
- Set up database metrics alerts

### Backup Strategy
- Automated daily backups
- Point-in-time recovery setup
- Cross-region backup replication

## Troubleshooting

### Common Issues

1. **Migration conflicts:**
   ```bash
   npx prisma migrate resolve --applied migration_name
   ```

2. **Schema drift:**
   ```bash
   npx prisma db push
   ```

3. **Connection issues:**
   - Verify DATABASE_URL format
   - Check firewall/security group settings
   - Ensure database is running

### Debug Commands
```bash
# Check Prisma client
npx prisma validate

# Introspect existing database
npx prisma db pull

# Format schema
npx prisma format
```

## Security Best Practices

1. **Use connection pooling** (PgBouncer)
2. **Enable SSL** for database connections
3. **Rotate database credentials** regularly
4. **Limit database user permissions**
5. **Enable audit logging**
6. **Use read replicas** for scaling
7. **Set up database firewall rules**
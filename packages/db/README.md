# @udp/db - Database Package

This package contains the Prisma schema, database client, and utilities for the United Dev Platform.

## Features

- **Prisma ORM** with PostgreSQL
- **NextAuth.js** integration for authentication
- **User management** with OAuth support
- **Project & File management** with collaborative features
- **Real-time collaboration** session tracking
- **User presence** and cursor tracking

## Quick Start

### 1. Set up your environment

```bash
cp ../../.env.example ../../.env
```

Edit `.env` and set your `DATABASE_URL`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/udp_dev?schema=public"
```

### 2. Generate Prisma Client

```bash
pnpm generate
```

### 3. Create database and run migrations

```bash
# Push schema to database (development)
pnpm db:push

# OR create migration (production)
pnpm db:migrate

# Seed database with demo data
pnpm db:seed
```

### 4. Open Prisma Studio (optional)

```bash
pnpm db:studio
```

## Available Scripts

- `pnpm generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database (no migrations)
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:migrate:deploy` - Apply pending migrations (CI/CD)
- `pnpm db:seed` - Seed database with demo data
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:reset` - Reset database (destructive!)

## Schema Overview

### NextAuth.js Models

- **User** - User accounts with OAuth support
- **Account** - OAuth account connections
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

### Application Models

- **Project** - Development projects with visibility controls
- **ProjectMember** - Project membership with roles (OWNER, ADMIN, MEMBER, VIEWER)
- **File** - Project files with content and version tracking
- **FileVersion** - File version history
- **CollaborativeSession** - Real-time editing rooms with Yjs state
- **UserPresence** - User cursor and selection tracking

## Usage in Code

```typescript
import { prisma } from '@udp/db';

// Create a project
const project = await prisma.project.create({
  data: {
    name: 'My Project',
    description: 'A collaborative project',
    visibility: 'PRIVATE',
    ownerId: user.id,
  },
});

// Query with relations
const projectWithFiles = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    files: true,
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    members: {
      include: {
        user: true,
      },
    },
  },
});
```

## Database Setup (Docker)

For local development, you can use Docker to run PostgreSQL:

```bash
docker run --name udp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=udp_dev \
  -p 5432:5432 \
  -d postgres:16-alpine
```

## Migrations

### Development

```bash
# Create migration after schema changes
pnpm db:migrate

# Reset database and reapply all migrations
pnpm db:reset
```

### Production

```bash
# Apply migrations in CI/CD
pnpm db:migrate:deploy
```

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"

# NextAuth (for session storage)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check `DATABASE_URL` is correct
2. Verify PostgreSQL is running
3. Check firewall/network settings
4. Verify database exists

### Migration Issues

```bash
# Reset database (development only!)
pnpm db:reset

# Generate new migration
pnpm db:migrate
```

### Prisma Client Not Found

```bash
# Regenerate client
pnpm generate
```

## Production Considerations

1. **Never commit `.env`** - Contains sensitive credentials
2. **Use connection pooling** - Configure `connection_limit` in DATABASE_URL
3. **Run migrations in CI** - Use `db:migrate:deploy`
4. **Backup your database** - Regular backups are critical
5. **Monitor queries** - Use Prisma's query logging in production

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Prisma Adapter](https://next-auth.js.org/adapters/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

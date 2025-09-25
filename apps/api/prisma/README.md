# United Dev Platform API - Prisma Setup

## 1. Database Setup

- Ensure your `DATABASE_URL` is set in `.env` (PostgreSQL recommended)
- Example:
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/udp_db
  ```

## 2. Run Initial Migration

```bash
pnpm exec prisma migrate dev --name init
```

## 3. Generate Prisma Client

```bash
pnpm exec prisma generate
```

## 4. Seed Data (optional)

Add a `seed.js` or `seed.ts` script if you want initial data.

## 5. Usage in API

- Import Prisma client in your API code:
  ```js
  import { PrismaClient } from "@prisma/client";
  export const prisma = new PrismaClient();
  ```

## 6. Useful Commands

- View schema: `pnpm exec prisma studio`
- Format schema: `pnpm exec prisma format`
- Reset DB: `pnpm exec prisma migrate reset`

## 7. Docs

- [Prisma Docs](https://www.prisma.io/docs)

import { defineConfig } from '@prisma/internals';
import { adapter } from '@prisma/adapter-sqlite';

export default defineConfig({
  datasource: {
    adapter: adapter({ url: process.env.DATABASE_URL || 'file:./dev.db' }),
  },
});



// Set up test database URL before importing Prisma
import fs from 'fs';
import path from 'path';
const dbDir = path.resolve(__dirname);
const dbPath = path.join(dbDir, '.test-integration.db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
process.env.DATABASE_URL = `file:${dbPath}`;

import { getConfig } from '../../packages/config';
import { prisma } from '../../packages/db/src/index';
import logger from '../../packages/logger';

describe('Integration: config, db, logger', () => {
  it('should load config and log info', () => {
    const config = getConfig();
    expect(config).toBeDefined();
    logger.info('Loaded config', config);
  });

  it('should connect and disconnect to the database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
    await expect(prisma.$disconnect()).resolves.not.toThrow();
  });

  // Add more integration scenarios as needed
});

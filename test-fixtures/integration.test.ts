import { getConfig } from '../packages/config';
import { prisma } from '../packages/db/src/index';
import logger from '../packages/logger';

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

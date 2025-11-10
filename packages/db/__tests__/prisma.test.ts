import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

/**
 * Database Integration Tests
 *
 * These tests validate the Prisma schema and basic database operations.
 * Note: These tests require a running PostgreSQL database.
 *
 * To run: pnpm test
 */

describe('Prisma Schema Validation', () => {
  it('should export prisma client', () => {
    // This test validates that the prisma client can be imported
    // The actual import will happen when Prisma client is generated
    const { prisma } = require('../src/index');
    expect(prisma).toBeDefined();
  });

  it('should have correct models defined', () => {
    const { prisma } = require('../src/index');

    // Check that models exist
    expect(prisma.user).toBeDefined();
    expect(prisma.project).toBeDefined();
    expect(prisma.file).toBeDefined();
    expect(prisma.projectMember).toBeDefined();
    expect(prisma.collaborativeSession).toBeDefined();
    expect(prisma.userPresence).toBeDefined();
  });
});

describe('Database Operations (requires DB)', () => {
  let createdUserId: string;
  let createdProjectId: string;

  // Skip these tests if DATABASE_URL is not set
  const skipIfNoDatabase = !process.env.DATABASE_URL;

  beforeAll(() => {
    if (skipIfNoDatabase) {
      console.log('⚠️  Skipping database tests - DATABASE_URL not configured');
    }
  });

  it.skip('should create a user', async () => {
    if (skipIfNoDatabase) return;

    const { prisma } = require('../src/index');

    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        username: `testuser${Date.now()}`,
      },
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toContain('@example.com');

    createdUserId = user.id;
  });

  it.skip('should create a project', async () => {
    if (skipIfNoDatabase || !createdUserId) return;

    const { prisma } = require('../src/index');

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'A test project',
        visibility: 'PRIVATE',
        ownerId: createdUserId,
      },
    });

    expect(project).toBeDefined();
    expect(project.id).toBeDefined();
    expect(project.name).toBe('Test Project');
    expect(project.visibility).toBe('PRIVATE');

    createdProjectId = project.id;
  });

  it.skip('should create a file in project', async () => {
    if (skipIfNoDatabase || !createdProjectId || !createdUserId) return;

    const { prisma } = require('../src/index');

    const file = await prisma.file.create({
      data: {
        name: 'test.ts',
        path: '/test.ts',
        content: 'console.log("hello");',
        language: 'typescript',
        size: 23,
        projectId: createdProjectId,
        createdById: createdUserId,
      },
    });

    expect(file).toBeDefined();
    expect(file.name).toBe('test.ts');
    expect(file.path).toBe('/test.ts');
  });

  it.skip('should query project with relations', async () => {
    if (skipIfNoDatabase || !createdProjectId) return;

    const { prisma } = require('../src/index');

    const project = await prisma.project.findUnique({
      where: { id: createdProjectId },
      include: {
        owner: true,
        files: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    expect(project).toBeDefined();
    expect(project?.owner).toBeDefined();
    expect(project?.files).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    if (skipIfNoDatabase) return;

    const { prisma } = require('../src/index');

    // Cleanup test data
    try {
      if (createdProjectId) {
        await prisma.project.delete({ where: { id: createdProjectId } });
      }
      if (createdUserId) {
        await prisma.user.delete({ where: { id: createdUserId } });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      await prisma.$disconnect();
    }
  });
});

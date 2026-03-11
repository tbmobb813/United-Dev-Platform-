import prisma from '../src/index';

describe('prisma client', () => {
  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('should have a $connect method', () => {
    expect(typeof prisma.$connect).toBe('function');
  });

  it('should have a $disconnect method', () => {
    expect(typeof prisma.$disconnect).toBe('function');
  });

  // Optionally, test a real query if a test DB is available
  // it('should connect and query the database', async () => {
  //   await prisma.$connect();
  //   const result = await prisma.user.findMany();
  //   expect(Array.isArray(result)).toBe(true);
  // });
});

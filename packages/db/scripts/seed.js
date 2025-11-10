const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create demo project
  const demoProject = await prisma.project.upsert({
    where: { id: 'demo-project-id' },
    update: {},
    create: {
      id: 'demo-project-id',
      name: 'Demo Project',
      description: 'A demo collaborative editing project',
      isPublic: true,
      ownerId: demoUser.id,
    },
  });

  console.log('✅ Created demo project:', demoProject.name);

  // Create demo files
  const indexFile = await prisma.file.upsert({
    where: { id: 'demo-file-index' },
    update: {},
    create: {
      id: 'demo-file-index',
      name: 'index.ts',
      path: '/index.ts',
      content: `// Welcome to United Dev Platform!\n\nfunction hello() {\n  console.log('Hello, collaborative coding!');\n}\n\nhello();\n`,
      language: 'typescript',
      size: 150,
      projectId: demoProject.id,
      createdById: demoUser.id,
    },
  });

  console.log('✅ Created demo file:', indexFile.name);

  // Create collaborative session
  const session = await prisma.collaborativeSession.upsert({
    where: { roomId: 'room-demo' },
    update: {},
    create: {
      roomId: 'room-demo',
      name: 'Demo Editing Room',
      projectId: demoProject.id,
      isActive: true,
    },
  });

  console.log('✅ Created collaborative session:', session.roomId);

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:',  e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const project = await prisma.project.findFirst({
    where: { name: 'Talos' }
  });

  if (!project) {
    console.log("No Talos project found.");
    return;
  }

  console.log(`Adding all users to project: ${project.name} (${project.id})`);

  for (const user of users) {
    try {
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: user.id
          }
        },
        update: { role: 'ADMIN' },
        create: {
          projectId: project.id,
          userId: user.id,
          role: 'ADMIN'
        }
      });
      console.log(`Added user ${user.name} (${user.email}) to project.`);
    } catch (err) {
      console.error(`Error adding user ${user.name}:`, err.message);
    }
  }
}

main().finally(() => prisma.$disconnect());

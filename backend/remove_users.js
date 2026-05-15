
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const priyaSingh = await prisma.user.findFirst({ where: { name: 'Priya Singh' } });
  
  if (!priyaSingh) {
    console.log("Priya Singh not found. Cannot reassign projects.");
    return;
  }

  const usersToRemove = ['Test User', 'Priya Kumari ']; // Note the space in Priya Kumari 

  for (const name of usersToRemove) {
    const user = await prisma.user.findFirst({ where: { name: name } });
    if (user) {
      console.log(`Processing removal of ${name} (${user.id})...`);
      
      // Reassign projects owned by this user
      const projects = await prisma.project.findMany({ where: { adminId: user.id } });
      for (const p of projects) {
        console.log(`Reassigning project ${p.name} to Priya Singh...`);
        await prisma.project.update({
          where: { id: p.id },
          data: { adminId: priyaSingh.id }
        });
      }

      // Delete memberships
      await prisma.projectMember.deleteMany({ where: { userId: user.id } });
      
      // Delete tasks assigned to them (optional, but good for cleanliness)
      await prisma.task.updateMany({
        where: { assigneeId: user.id },
        data: { assigneeId: null }
      });

      // Finally delete the user
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`User ${name} removed successfully.`);
    } else {
      console.log(`User ${name} not found.`);
    }
  }
}

main().finally(() => prisma.$disconnect());

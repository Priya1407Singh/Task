
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log("No user found, creating a default admin user...");
      user = await prisma.user.create({
        data: {
          name: 'Priya',
          email: 'priya@example.com',
          password: 'password123', // In real app, hash this
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        name: 'Talos',
        description: 'Strategic Defense and Management System',
        adminId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      }
    });

    console.log(`Project created: ${project.name} (ID: ${project.id})`);
  } catch (error) {
    console.error("Error creating project:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

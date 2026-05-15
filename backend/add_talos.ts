
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  
  if (!user) {
    console.log("No user found, creating a default admin user...");
    user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashedpassword', // In real app, hash this
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

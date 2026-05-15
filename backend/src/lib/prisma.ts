import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

console.log('Available Env Vars:', Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('PASSWORD')));
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

// Use a placeholder if missing just to prevent crash during boot so we can see logs
const dbUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

export default prisma;

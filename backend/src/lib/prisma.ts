import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Detailed Debugging
const allKeys = Object.keys(process.env);
console.log('--- ENV DEBUG START ---');
console.log('Total Env Vars:', allKeys.length);
console.log('Search for DATABASE:', allKeys.filter(k => k.toLowerCase().includes('database')));
console.log('Search for URL:', allKeys.filter(k => k.toLowerCase().includes('url')));
console.log('--- ENV DEBUG END ---');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('FATAL: DATABASE_URL is absolutely missing from process.env!');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl || "postgresql://dummy:dummy@localhost:5432/dummy",
    },
  },
});

export default prisma;

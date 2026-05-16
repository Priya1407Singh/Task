import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Using the provided public connection string directly to ensure connectivity
const dbUrl = "postgresql://postgres:MGSeaWMAUjwSBpJpKBmaxxZgctHshble@yamanote.proxy.rlwy.net:24813/railway";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

export default prisma;

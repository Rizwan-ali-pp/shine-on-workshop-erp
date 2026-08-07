import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const defaultPin = '1234';
  const salt = await bcrypt.genSalt(10);
  const pinHash = await bcrypt.hash(defaultPin, salt);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { pinHash },
    create: {
      username: 'admin',
      pinHash,
    },
  });

  console.log('Admin user seeded with PIN 1234', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@digitalheroes.com' },
    update: {},
    create: {
      email: 'admin@digitalheroes.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const charities = [
    { name: 'Global Health Fund', description: 'Improving healthcare access worldwide.' },
    { name: 'Education for All', description: 'Providing education resources for underprivileged children.' },
    { name: 'Green Earth Initiative', description: 'Focusing on reforestation and climate action.' },
  ];

  for (const charity of charities) {
    await prisma.charity.create({
      data: charity
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

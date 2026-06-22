import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in reverse dependency order)
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  // Create test users with initial balance (in cents: 10000 = $100.00)
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password,
      balance: 100000, // $1,000.00
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password,
      balance: 50000, // $500.00
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      name: 'Carol Williams',
      password,
      balance: 75000, // $750.00
    },
  });

  // Create sample completed payments
  const payment1 = await prisma.payment.create({
    data: {
      amount: 2500,      // $25.00
      currency: 'USD',
      status: 'COMPLETED',
      description: 'Coffee money',
      senderId: alice.id,
      receiverId: bob.id,
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      amount: 5000,      // $50.00
      currency: 'USD',
      status: 'COMPLETED',
      description: 'Dinner split',
      senderId: bob.id,
      receiverId: carol.id,
    },
  });

  // Matching transaction records
  await prisma.transaction.createMany({
    data: [
      { type: 'DEBIT',  amount: 2500, reference: `PAY-${payment1.id}-D`, userId: alice.id, metadata: { paymentId: payment1.id } },
      { type: 'CREDIT', amount: 2500, reference: `PAY-${payment1.id}-C`, userId: bob.id,   metadata: { paymentId: payment1.id } },
      { type: 'DEBIT',  amount: 5000, reference: `PAY-${payment2.id}-D`, userId: bob.id,   metadata: { paymentId: payment2.id } },
      { type: 'CREDIT', amount: 5000, reference: `PAY-${payment2.id}-C`, userId: carol.id, metadata: { paymentId: payment2.id } },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('\nTest accounts (password: password123):');
  console.log(`  alice@example.com  — balance: $1,000.00`);
  console.log(`  bob@example.com    — balance:   $500.00`);
  console.log(`  carol@example.com  — balance:   $750.00`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

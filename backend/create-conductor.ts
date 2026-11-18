import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: npm run add-conductor <email> <password> <name> [mobile] [gender]');
    console.error('Example: npm run add-conductor conductor2@test.com mypass123 "John Doe" "9876543210" "Male"');
    process.exit(1);
  }

  const [email, password, name, mobile = null, gender = null] = args;

  const existing = await prisma.conductor.findUnique({ where: { email } });
  if (existing) {
    console.error(`Error: Conductor with email ${email} already exists.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const conductor = await prisma.conductor.create({
    data: {
      email,
      password: hashedPassword,
      name,
      mobile,
      gender
    }
  });

  console.log('✅ Successfully created new Conductor!');
  console.log(`Conductor ID (Email): ${conductor.email}`);
  console.log(`Name: ${conductor.name}`);
}

main()
  .catch((e) => {
    console.error('Error creating conductor:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

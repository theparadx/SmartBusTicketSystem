import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'conductor1@busticket.com';
  
  const existing = await prisma.conductor.findUnique({ where: { email } });
  
  if (existing) {
    console.log('Conductor already exists:', existing.email);
    return;
  }
  
  const hashedPassword = await bcrypt.hash('conductor123', 10);
  
  const conductor = await prisma.conductor.create({
    data: {
      name: 'Admin Conductor',
      email: email,
      password: hashedPassword,
      mobile: '1234567890',
      gender: 'Male'
    }
  });
  
  console.log('Created initial conductor account:');
  console.log(`Email (Conductor ID): ${conductor.email}`);
  console.log(`Password: conductor123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



// ############################################

// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// async function main() {
//   const conductors = [
//     {
//       email: 'conductor1@busticket.com',
//       password: 'conductor123',
//       name: 'Admin Conductor',
//       mobile: '1234567890',
//       gender: 'Male',
//     },
//     {
//       email: 'conductor2@busticket.com',
//       password: 'conductor456',
//       name: 'Second Conductor',
//       mobile: '9876543210',
//       gender: 'Male',
//     },
//   ];

//   for (const conductorData of conductors) {
//     const existing = await prisma.conductor.findUnique({
//       where: {
//         email: conductorData.email,
//       },
//     });

//     if (existing) {
//       console.log(`Conductor already exists: ${existing.email}`);
//       continue;
//     }

//     const hashedPassword = await bcrypt.hash(conductorData.password, 10);

//     const conductor = await prisma.conductor.create({
//       data: {
//         name: conductorData.name,
//         email: conductorData.email,
//         password: hashedPassword,
//         mobile: conductorData.mobile,
//         gender: conductorData.gender,
//       },
//     });

//     console.log('Created conductor account:');
//     console.log(`Email (Conductor ID): ${conductor.email}`);
//     console.log(`Password: ${conductorData.password}`);
//     console.log('-----------------------------------');
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
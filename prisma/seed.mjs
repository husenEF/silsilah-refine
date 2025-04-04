import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create some root users (without parents)
  const rootUsers = await Promise.all(
    Array(5).fill(null).map(async () => {
      return await prisma.user.create({
        data: {
          nickname: faker.internet.username(),
          name: faker.person.fullName(),
          genderId: faker.datatype.boolean(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          phone: faker.phone.number(),
          dob: faker.date.past({ years: 70 }),
          yob: faker.number.int({ min: 1950, max: 1980 }),
          birthOrder: faker.number.int({ min: 1, max: 5 }),
        },
      });
    })
  );

  // Create couples
  await Promise.all(
    rootUsers.filter(u => !u.genderId).map(async (husband) => {
      const wife = rootUsers.find(u => u.genderId && !u.motherId);
      if (wife) {
        return await prisma.couple.create({
          data: {
            husbandId: husband.id,
            wifeId: wife.id,
            marriageDate: faker.date.past({ years: 30 }),
          },
        });
      }
    })
  );

  // Create children for couples
  const couples = await prisma.couple.findMany();
  await Promise.all(
    couples.map(async (couple) => {
      const numChildren = faker.number.int({ min: 1, max: 4 });
      return await Promise.all(
        Array(numChildren).fill(null).map(async (_, index) => {
          return await prisma.user.create({
            data: {
              nickname: faker.internet.username(),
              name: faker.person.fullName(),
              genderId: faker.datatype.boolean(),
              fatherId: couple.husbandId,
              motherId: couple.wifeId,
              email: faker.internet.email(),
              password: faker.internet.password(),
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              phone: faker.phone.number(),
              dob: faker.date.past({ years: 30 }),
              yob: faker.number.int({ min: 1980, max: 2000 }),
              birthOrder: index + 1,
            },
          });
        })
      );
    })
  );

  // Add some user metadata
  const allUsers = await prisma.user.findMany();
  await Promise.all(
    allUsers.map(async (user) => {
      return await prisma.userMetadata.create({
        data: {
          userId: user.id,
          key: 'bio',
          value: faker.lorem.paragraph(),
        },
      });
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
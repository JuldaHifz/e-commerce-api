import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import authorizationSeeds from "./authorization-seeds.js";

config();

const prisma = new PrismaClient();
const bcryptRound = Number(process.env.BCRYPT_ROUND);

async function main() {
  await prisma.token.deleteMany();

  // must delete user, permissionRole. role. and permission respectively after deleting token, and then fill the permissionRole, role, and permission again
  await authorizationSeeds().catch((e) => {
    throw e;
  });

  const roles = await prisma.role.findMany();
  const sellerRole = roles[0].id;
  const regularUserRole = roles[1].id;

  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("password", bcryptRound),
        role_id: regularUserRole,
      },
    });
  }

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("passwordseller", bcryptRound),
      role_id: sellerRole,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// console.log(await prisma.token.deleteMany());
// const roles = await prisma.role.findMany();
// console.log(roles);
// console.log(roles[0].id);

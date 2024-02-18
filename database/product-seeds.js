import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { config } from "dotenv";

config();
const prisma = new PrismaClient();

export default prisma;

async function main() {
  await prisma.product.deleteMany();

  for (let i = 0; i < 50; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: Number(
          faker.commerce.price({ min: 50000, max: 5000000, dec: 0 })
        ),
        in_stock: faker.datatype.boolean(),
        description: faker.commerce.productDescription(),
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

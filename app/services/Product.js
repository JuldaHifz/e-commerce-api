import { Prisma } from "@prisma/client";
import Service from "./Service.js";

class Product extends Service {
  model = Prisma.ModelName.Product;

  async search(queryParams) {
    const { name, category, description } = queryParams;

    return await this.prisma[this.model].findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : undefined,
          category ? { category: { contains: category } } : undefined,
          description ? { description: { contains: description } } : undefined,
        ].filter(Boolean),
      },
      include: this.getRelation(),
    });
  }
}

export default new Product();

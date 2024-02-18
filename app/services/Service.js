import { PrismaClient } from "@prisma/client";

class Service {
  prisma;
  model;
  relation;

  constructor() {
    this.prisma = new PrismaClient();
    this.relation = [];
  }

  withRelation(relation) {
    // console.log(relation);
    // console.log(this.relation);
    this.relation.push(relation);
    // console.log(relation);
    // console.log(this.relation);
    return this;
  }

  getRelation() {
    return this.relation.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      };
    }, {});
  }

  async get() {
    return await this.prisma[this.model].findMany({
      include: this.getRelation(),
    });
  }

  async find(id) {
    try {
      return await this.prisma[this.model].findUnique({
        where: { id: Number(id) },
      });
    } catch (err) {
      throw new Error("Not found");
    }
  }

  async store(data) {
    return await this.prisma[this.model].create({ data });
  }

  async update(id, data) {
    try {
      return await this.prisma[this.model].update({
        where: { id: Number(id) },
        data,
      });
    } catch (err) {
      throw new Error("Not found");
    }
  }

  async delete(id) {
    try {
      return await this.prisma[this.model].delete({
        where: { id: Number(id) },
      });
    } catch (err) {
      throw new Error("Not found");
    }
  }
}

export default Service;

import { PrismaClient } from "@prisma/client";
import {
  Role,
  Permission,
  PermissionAssignment,
} from "../app/authorization.js";

const prisma = new PrismaClient();

const authorizationSeeds = async () => {
  await prisma.user.deleteMany();
  await prisma.permissionRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  for (const role in Role) {
    await prisma.role.create({
      data: {
        name: Role[role],
      },
    });
  }

  for (const permission in Permission) {
    await prisma.permission.create({
      data: {
        name: Permission[permission],
      },
    });
  }

  for (const role in PermissionAssignment) {
    for (const permission of PermissionAssignment[role]) {
      await prisma.permissionRole.create({
        data: {
          permission: {
            connect: {
              name: permission,
            },
          },
          role: {
            connect: {
              name: role,
            },
          },
        },
      });
    }
  }
};

// main().catch((e) => {
//   throw e;
// });

export default authorizationSeeds;

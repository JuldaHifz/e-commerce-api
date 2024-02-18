import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  const validToken = await prisma.token.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_blocked: true,
          role_id: true,
        },
      },
    },
  });
  //   console.log("valid token", validToken);
  if (!validToken) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  if (validToken.expires_at < new Date()) {
    return res.status(401).json({ message: "Token has expired" });
  }

  if (validToken.user.is_blocked) {
    return res.status(401).json({ message: "Your account has been blocked" });
  }

  req.user = validToken.user;
  //   console.log(req.user);
  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(req.user);
    // console.log(permission);

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });
    // console.log(permissionRecords);

    const permissions = permissionRecords.map(
      (record) => record.permission.name
    );
    // console.log(permissions);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

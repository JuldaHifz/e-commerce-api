import bcrypt from "bcrypt";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { validateTokenRequest } from "../validators.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/login", validateTokenRequest, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid Email" });
  }

  if (user.is_blocked) {
    return res.status(401).json({ message: "Your account has been blocked" });
  }

  if (!(req.body.password.length >= 8)) {
    console.log(req.body.password.length);
    return res
      .status(401)
      .json({ message: "Password must be at least 8 characters" });
  }

  const validPassword = bcrypt.compareSync(req.body.password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  let token;
  do {
    token = crypto.randomBytes(64).toString("base64");
  } while (await prisma.token.findUnique({ where: { token } }));

  await prisma.token.create({
    data: {
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //30 days
    },
  });

  res.json({ token });
});

export default router;

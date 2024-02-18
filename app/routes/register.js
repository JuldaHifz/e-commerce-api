import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = Router();
const bcryptRound = Number(process.env.BCRYPT_ROUND);

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password.length > 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, bcryptRound),
      role_id: 2,
    },
  });

  res.json({ message: "Register Success" });
});

export default router;

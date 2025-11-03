const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

async function register({ name, email, password }) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });
  const token = generateToken(user);
  return { user, token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { user, token };
}

module.exports = { register, login };

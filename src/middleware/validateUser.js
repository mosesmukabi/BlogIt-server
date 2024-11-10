import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
async function validateUser(req, res, next) {
  const { firstName, lastName, email, username, password } = req.body;
  if (!firstName || !lastName || !email || !username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const existingUser = await client.user.findFirst({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const existingUserName = await client.user.findFirst({
    where: { userName: username },
  });
  if (existingUserName) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  next();
}

export default validateUser;

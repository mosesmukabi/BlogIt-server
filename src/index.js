import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const client = new PrismaClient();

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } = req.body;

    const HashedPassword = await bcrypt.hash(password, 8);

    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        userName,
        password: HashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

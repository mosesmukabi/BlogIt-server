import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

const client = new PrismaClient();

app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await client.user.findFirst({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const existingUserName = await client.user.findFirst({ where: { userName: username } });
    if (existingUserName) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        userName: username, // Mapping "username" to "userName" for Prisma
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await client.user.findFirst({ where: { userName } });
    if (!user) {
      res.status(404).json({ message: 'Invalid username or password' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(404).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(200).cookie('authToken', token, { httpOnly: true }).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const client = new PrismaClient();


export const createUser = async (req, res) => {
    try {
      const { firstName, lastName, email, username, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 8);
  
      const newUser = await client.user.create({
        data: {
          firstName,
          lastName,
          email,
          userName: username, 
          password: hashedPassword,
        },
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
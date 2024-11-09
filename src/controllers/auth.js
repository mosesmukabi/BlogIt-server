import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const client = new PrismaClient();




export const loginUser = async (req, res) => {
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
  }



  export async function updatePassword(req, res) {
    try {
      const userId = req.userId;
      const { oldPassword, newPassword } = req.body;

      const user = await client.user.findFirst({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

    const theyMatch =  await bcrypt.compare(oldPassword, user.password);
    if (theyMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      const updated = await client.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword
        },
      })
      res.status(200).json({message: 'Password updated successfully'});
    }

      
  } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }


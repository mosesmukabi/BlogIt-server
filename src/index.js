import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST","PATCH", "PUT", "DELETE"],
}));

const client = new PrismaClient();

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body; 
    if (!firstName){
      res.status(400).json({message: "First name is required"});
      return;
    }
    if (!lastName){
      res.status(400).json({message: "Last name is required"});
      return;
    }
    if (!email){    
      res.status(400).json({message: "email is required"});
      return;
    }
    if (!username){
      res.status(400).json({message: "username is required"});
      return;
    }
    if (!password){
      res.status(400).json({message: "password is required"});
      return;
    }

    const userEmail = await client.user.findFirst({
      where: {
        email: email
      }
    })
    if (userEmail){
      res.status(400).json({message: "email already exists"});
      return;
    }

    const userName = await client.user.findFirst({
      where: {
        userName: username
      }
    })
    if (userName){
      res.status(400).json({message: "username already exists"});
      return;
    }

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
     
    res.status(500).json({ message: "Something went wrong"});
  }
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

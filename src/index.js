import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createUser } from "./controllers/user.js";
import { loginUser, updatePassword } from "./controllers/auth.js";
import validateUser from "./middleware/validateUser.js";
import {
  createBlog,
  fetchSingleBlog,
  fetchAllBlogs,
  getUserBlogs,
  deleteBlog,
  updateBlog,
  updatePersonalInfo,
  getUserProfile,
} from "./controllers/blogs.js";
import verifyToken from "./middleware/verifyToken.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.post("/users", validateUser, createUser);

app.get("/users/me", verifyToken, getUserProfile);

app.put("/users", verifyToken, updatePersonalInfo);

app.post("/auth/login", loginUser);

app.patch("/auth/password", verifyToken, updatePassword);

app.post("/blogs", verifyToken, createBlog);

app.get("/blogs/user", verifyToken, getUserBlogs);

app.get("/blogs/:id", fetchSingleBlog);

app.get("/blogs", verifyToken, fetchAllBlogs);

app.delete("/blogs/:blogId", verifyToken, deleteBlog);

app.put("/blogs/:blogId", verifyToken, updateBlog);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

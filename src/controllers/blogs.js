import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createBlog(req, res) {
    try{
        const { title, excerpt, body, featuredImage } = req.body;
        const userId = req.userId;
       const newBlog = await prisma.blog.create({
            data: {
                title,
                excerpt,
                body,
                featuredImage,
                owner: userId
            }
        })
        res.status(201).json(newBlog);
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export  async  function fetchSingleBlog(req, res) {
    try {
        const { id } = req.params;
       const blog = await prisma.blog.findFirst({
           where: {
               id
           }, 
           include: {
            user: true
           }
           
       })

       if (!blog) {
           return res.status(404).json({ message: 'Blog not found' });
       }
       res.status(200).json(blog);

    }  catch(error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export  async function fetchAllBlogs(req, res) {
    try{
        const blogs = await prisma.blog.findMany({
            include:{
                user: true
            }

        })

        res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
}

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

export async function getUserBlogs(req, res) {

    try{
        const userId = req.userId;
        const blogs = await prisma.blog.findMany({
            where: {
                owner: userId
            }
        })

        res.status(200).json(blogs); 
    } catch(error) { 
        res.status(400).json({ message: 'Something went wrong' });       
    }
} 


export async function deleteBlog(req, res) {
    try {
      const { blogId } =  req.params
      const { userId } = req.userId;

       await prisma.blog.delete({
        where: {
            id: blogId,
            owner: userId

        }
          
      })
       res.status(200).json({message: 'Blog deleted successfully'});
    }
    catch(error) {
        res.status(500).json({ message: 'Something went wrong' });       
    }
}


export async function updateBlog(req, res) {
    try{
        const { title, excerpt, body, featuredImage } = req.body;
        const { blogId } = req.params;
        const { userId } = req.userId;
        await prisma.blog.update({
            where: {
                id : blogId,
                owner: userId
            },
            data: {
                title,
                excerpt,
                body,
                featuredImage
            }

        })
        res.status(200).json({message: 'Blog updated successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}
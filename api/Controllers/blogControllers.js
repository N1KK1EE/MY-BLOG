const Blog = require('../Models/blog');
const User = require('../Models/user');
const mongoose = require('mongoose');

// Calculate reading time (simple algorithm: 200 words per minute)
const calculateReadingTime = (body) => {
  const wordCount = body.split(' ').length;
  return Math.ceil(wordCount / 200); // Assuming 200 words per minute
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, body, tags } = req.body;
    const newBlog = new Blog({
      title,
      description,
      body,
      tags,
      author: req.user.id,
      reading_time: calculateReadingTime(body),
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update blog state to published
exports.updateBlogState = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Blog ID' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    blog.state = 'published';
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

//Get a list of published blogs (with pagination)
exports.getBlogs = async (req, res) => {
  try {
     const { page = 1, limit = 20, search = '', sort = 'timestamp' } = req.query;

  const blogs = await Blog.find({ state: 'published', $text: { $search: search } })
      .sort({ [sort]: 1 })
       .skip((page - 1) * limit)
       .limit(Number(limit))
       .populate('author', 'first_name last_name email');
       
     res.json(blogs);
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
 };

// // Get a single blog by ID
exports.getBlog = async (req, res) => {
 try {
     const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');

    if (!blog || blog.state !== 'published') {
       return res.status(404).json({ message: 'Blog not found' });
     }

     blog.read_count += 1;
     await blog.save();

     res.json(blog);
  } catch (error) {
     console.error("Error creating blog:", error);
    res.status(500).json({ message: 'Server Error' });
   }
 };
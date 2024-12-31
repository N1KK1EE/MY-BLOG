const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogControllers');
const authMiddleware = require('../Middlewares/authMiddleware')

// Public routes
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes (authentication required)
router.post('/create', authMiddleware, blogController.createBlog);
router.put('/:id/publish', authMiddleware, blogController.updateBlogState);

module.exports = router;

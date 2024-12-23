// const express = require('express');
// // const { blogController } = require('../Controllers/blogController');
// const { protect } = require('../Middlewares/authMiddleware');
// const router = express.Router();
// const {createBlog} = require('../Middlewares/authController')

// router.post('/create', protect, createBlog);

// module.exports = router;


const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogControllers');
const authMiddleware = require('../Middlewares/authMiddleware')

// Public routes
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlog);

// Protected routes (authentication required)
router.post('/create', authMiddleware, blogController.createBlog);
router.put('/:id/publish', authMiddleware, blogController.updateBlogState);

module.exports = router;

const express = require('express');
// const { blogController } = require('../Controllers/blogController');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();
const {createBlog} = require('../Controllers/blogController')

router.post('/create', protect, createBlog);

module.exports = router;
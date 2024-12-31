const request = require('supertest');
const app = require('../server'); // Your Express app
const Blog = require('../Models/blog');
const User = require('../Models/user'); // Assuming user model exists
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

let userToken;

// Before running any tests, create a user and generate a JWT token for authentication
beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect('mongodb://localhost:27017/blogAppTest', { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a user and sign in
  const user = new User({
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    password: 'password123'
  });
  await user.save();

  // Generate JWT for the user
  const payload = { userId: user._id };
  userToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
});

// Clean up the database after each test
afterEach(async () => {
  await Blog.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test case for creating a blog
describe('Blog API Endpoints', () => {
  it('should create a blog post', async () => {
    const response = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test Blog',
        description: 'A test blog description',
        body: 'This is the body of the test blog',
        tags: ['test', 'blog']
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Blog');
    expect(response.body.state).toBe('draft'); // Default state is draft
  });

  it('should get all blogs', async () => {
    // Create a blog post
    const newBlog = new Blog({
      title: 'Test Blog',
      description: 'A test blog description',
      body: 'This is the body of the test blog',
      tags: ['test', 'blog'],
      author: mongoose.Types.ObjectId(),
      reading_time: 5,
      read_count: 0,
      state: 'published',
      timestamp: new Date()
    });

    await newBlog.save();

    const response = await request(app).get('/api/blogs');
    
    expect(response.status).toBe(200);
    expect(response.body.blogs.length).toBeGreaterThan(0);
    expect(response.body.blogs[0].title).toBe('Test Blog');
  });

  it('should get a specific blog by ID', async () => {
    const newBlog = new Blog({
      title: 'Another Test Blog',
      description: 'A test blog description',
      body: 'This is the body of the test blog',
      tags: ['test', 'blog'],
      author: mongoose.Types.ObjectId(),
      reading_time: 5,
      read_count: 0,
      state: 'published',
      timestamp: new Date()
    });

    await newBlog.save();

    const response = await request(app).get(`/api/blog/${newBlog._id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Another Test Blog');
    expect(response.body.state).toBe('published');
  });

  it('should update a blog', async () => {
    const newBlog = new Blog({
      title: 'Blog to Update',
      description: 'A blog to update',
      body: 'This is the body of the blog',
      tags: ['update', 'blog'],
      author: mongoose.Types.ObjectId(),
      reading_time: 5,
      read_count: 0,
      state: 'draft',
      timestamp: new Date()
    });

    await newBlog.save();

    const response = await request(app)
      .put(`/api/blog/${newBlog._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Updated Blog Title',
        description: 'Updated description',
        body: 'Updated body content',
        tags: ['updated', 'blog']
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Blog Title');
    expect(response.body.state).toBe('draft');
  });

  it('should delete a blog', async () => {
    const newBlog = new Blog({
      title: 'Blog to Delete',
      description: 'A blog to delete',
      body: 'This is the body of the blog',
      tags: ['delete', 'blog'],
      author: mongoose.Types.ObjectId(),
      reading_time: 5,
      read_count: 0,
      state: 'draft',
      timestamp: new Date()
    });

    await newBlog.save();

    const response = await request(app)
      .delete(`/api/blog/${newBlog._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Blog deleted successfully');
  });
});
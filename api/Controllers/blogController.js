const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/user');
const Blog = require('../Models/blog');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await User.create({ first_name, last_name, email, password });
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.createBlog = (req, res) => {
  res.status(201).json({ message: 'Blog created successfully' });
};

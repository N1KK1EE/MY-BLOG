const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/user');
require('dotenv').config()

// exports.register = async (req, res) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     const user = await User.create({ first_name, last_name, email, password });
//     res.status(201).json({ message: 'User registered', user });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (user && (await bcrypt.compare(password, user.password))) {
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Logged in', token });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };


// Sign Up
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ first_name, last_name, email, password: hashedPassword });
    console.log(newUser)

    // Save user to database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Sign In
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
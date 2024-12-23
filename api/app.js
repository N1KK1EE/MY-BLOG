const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const blogRoutes = require('./Routes/blogRoutes');
const { errorMiddleware } = require('./Middlewares/errorMiddleware');
const PORT = process.env.PORT || 3022;

dotenv.config();
connectDB();

const app = express();


app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");

app.get('/', (req, res) => {
 console.log(req.url)
    res.render('index', { message: 'Welcome to the Blogging Platform!' });
  });


app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });

// module.exports = app;

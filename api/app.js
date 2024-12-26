const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const blogRoutes = require('./Routes/blogRoutes');
const { errorMiddleware } = require('./Middlewares/errorMiddleware');
const PORT = process.env.PORT || 3022;

dotenv.config();


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs");
app.set("views", "./Views");

app.get('/', (req, res) => {
 console.log(req.url)
    res.render('signIn', { message: 'Welcome to the Blogging Platform!' });
  });

  app.get('/', (req, res) => {
    console.log(req.url)
       res.render('signUp', { message: 'Welcome to the Blogging Platform!' });
     });

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use(errorMiddleware);



module.exports = app;

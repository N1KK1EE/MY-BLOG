const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require('./config/db');
const authRoutes = require("./Routes/authRoutes");
const blogRoutes = require("./Routes/blogRoutes");
//const errorMiddleware = require("./Middlewares/errorMiddleware");

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', './Views');

app.get("/", (req, res) => {
   console.log(req.url)
 res.render('signin', { message: 'Welcome to the Blogging Platform!' });
 });

   app.get("/signUp", (req, res) => {
    console.log(req.url)
      res.render('signUp', { message: 'Create your account!' });
    });

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

connectDB();

//app.use(errorMiddleware);

const PORT = process.env.PORT || 3022;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;

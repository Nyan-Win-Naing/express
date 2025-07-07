// console.log("app is running");

const express = require("express");
let morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require('./models/Blog');

const app = express();

// db url
let mongoUrl =
  "mongodb+srv://nyanwinnaing:test1234@cluster0.fimurck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connected to db");
    app.listen(3000, () => {
      console.log("app is running on port 3000");
    });
  })
  .catch((e) => {
    console.log(e);
  });

app.set("views", "./views");
app.set("view engine", "ejs");

// let logger = (req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl} --`);
//   next();
// };

// let logger = (env) => {
//   return (req, res, next) => {
//     if(env === 'dev') {
//       console.log(`${req.method} ${req.originalUrl} --`);
//     }

//     next();
//   };
// };

// app.use(logger());

app.use(morgan("dev"));
app.use(express.static("public"));

app.get('/add-blog', async (req, res) => {
  let blog = new Blog({
    title: "blog title 3",
    intro: "blog intro 3",
    body: "blog body 3",
  });
  await blog.save();
  res.send("blog saved");
});

app.get('/single-blog', async (req, res) => {
  let blog = await Blog.findById("686bed88b4d585862f308e10");
  res.json(blog);
});

app.get("/", async (req, res) => {

  let blogs = await Blog.find().sort({createdAt: -1});

  console.log(blogs);

  res.render("home", {
    // name: "mgmg",
    // age: 22,
    // blogs: blogs,
    blogs,
    title: "Home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

// app.get('/about-us', (req, res) => {
//     res.redirect("/about");
// });

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Not Found",
  });
});

// console.log("app is running");

const express = require("express");
let morgan = require("morgan");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const Blog = require("./models/Blog");

const app = express();

app.use(express.urlencoded({ extended: true }));

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
app.use(expressLayouts);
app.set("layout", "layouts/default");

app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/add-blog", async (req, res) => {
  let blog = new Blog({
    title: "blog title 3",
    intro: "blog intro 3",
    body: "blog body 3",
  });
  await blog.save();
  res.send("blog saved");
});

app.get("/", async (req, res) => {
  let blogs = await Blog.find().sort({ createdAt: -1 });

  console.log(blogs);

  res.render("home", {
    blogs,
    title: "Home",
  });
});

app.post("/blogs", async (req, res) => {
  let { title, intro, body } = req.body;

  let blog = new Blog({
    title,
    intro,
    body,
  });
  await blog.save();

  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
  });
});

app.get("/blogs/create", (req, res) => {
  res.render("blogs/create", {
    title: "Blog Create",
  });
});

app.get("/blogs/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let blog = await Blog.findById(id);
    // res.json(blog);

    res.render("blogs/show", {
      blog,
      title: "Blog Detail",
    });
  } catch (e) {
    console.log(e);
    next();
  }
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Not Found",
  });
});

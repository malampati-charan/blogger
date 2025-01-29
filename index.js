import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist"),
);
// use inbuilt parser from express
app.use(express.urlencoded({ extended: true }));
// do the alerts in non ajax way, using middleware
app.use((req, res, next) => {
  res.locals.msg = null;
  res.locals.class = "alert-info";
  next();
});

// Start the app
app.listen(PORT, () => {
  console.log("Server is up and running....");
});

// Index page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Blog Creation Page
let posts = [];
app.get("/Create-Post", (req, res) => {
  res.render("create-post.ejs");
});

app.post("/submit", (req, res) => {
  const title = req.body["title"];
  const content = req.body["content"];

  let obj = {
    title: title,
    content: content,
  };

  const created = true;
  if (created) {
    res.locals.msg = "Post Created Successfully!";
    res.locals.class = "alert-success";
  }

  posts.push(obj);
  res.render("create-post.ejs");
});

// Blog Deletion Page
app.get("/Delete-Posts", (req, res) => {
  res.render("delete-posts.ejs");
});

app.post("/delete", (req, res) => {
  let number = parseInt(req.body.number, 10); // Convert input to number

  let msg, alertClass;

  if (!isNaN(number) && number >= 0 && number < posts.length) {
    posts.splice(number, 1);
    msg = "Deletion Successful!";
    alertClass = "alert-success"; // Use success color for deletion
  } else {
    msg = "Deletion Unsuccessful! Invalid index.";
    alertClass = "alert-danger";
  }

  res.render("delete-posts.ejs", { msg, class: alertClass });
});

// Viewing Page
app.get("/View-Posts", (req, res) => {
  res.render("view-posts.ejs", { posts });
});

// About Page
app.get("/About", (req, res) => {
  res.render("about.ejs");
});

const express = require("express");
const app = express();
const path = require("path");
const puppeteer = require("puppeteer");
require("dotenv").config();

const login = require("./puppeteer/login");
const getPages = require("./puppeteer/getPages");
const getComments = require("./puppeteer/getComments");
const deleteComment = require("./puppeteer/deleteComment");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let browser, page;

app.get("/", async (req, res) => {
  res.render("index", { pages: null, error: null });
});

app.post("/login", async (req, res) => {
  try {
    ({ browser, page } = await login());
    const pages = await getPages(page);
    res.render("dashboard", { pages });
  } catch (err) {
    res.render("index", { pages: null, error: "Login បរាជ័យ!" });
  }
});

app.post("/comments", async (req, res) => {
  const { pageId } = req.body;
  const comments = await getComments(page, pageId);
  res.json(comments);
});

app.post("/delete", async (req, res) => {
  const { commentId } = req.body;
  const success = await deleteComment(page, commentId);
  res.json({ success });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
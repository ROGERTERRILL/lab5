const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");

const tools = require("./tools.js");

//routes
app.get("/", async function(req, res) {
  let imageURLs = await tools.getRandomImages("", 1);
  res.render("index", { imageURLs: imageURLs });
});

app.get("/search", async function(req, res) {
  let keyword = req.query.keyword;
  let imageURLs = await tools.getRandomImages(keyword, 9);
  res.render("results", { imageURLs: imageURLs, keyword: keyword });
}); //search

app.get("/api/updateFavorites", function(req, res) {
  let conn = tools.createConnection();
  let sql;
  let sqlParams;

  if (req.query.action == "add") {
    sql = "INSERT INTO favorites (imageURL, keyword) VALUES (?,?)";
    sqlParams = [req.query.imageURL, req.query.keyword];
  } else {
    sql = "DELETE FROM favorites WHERE imageURL = ?";
    sqlParams = [req.query.imageURL];
  }

  conn.connect(function(err) {
    if (err) throw err;
    conn.query(sql, sqlParams, function(err, result) {
      if (err) throw err;
    });
  });
  res.send("it works");
});

app.get("/displayKeywords", async function(req, res) {
  let imageURLs = await tools.getRandomImages("", 1);
  let conn = tools.createConnection();
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  conn.connect(function(err) {
    if (err) throw err;
    conn.query(sql, function(err, result) {
      if (err) throw err;
      res.render("favorites", { rows: result, imageURLs:imageURLs });
    });
  });
});

app.get("/api/displayFavorites", function(req, res) {
  let conn = tools.createConnection();
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];

  conn.connect(function(err) {
    if (err) throw err;
    conn.query(sql, sqlParams, function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
});


//server listener
app.listen(process.env.PORT || 8081, process.env.IP, function() {
  console.log("Express server is running...");
});

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
  const conn = mysql.createConnection({
    host: "h7xe2knj2qb6kxal.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "gnewapnqn1mxo7lh",
    password: "mc7p457sh8eiw6t0",
    database: "p2m3kzarz8vuqcpc"
  });

  let sql;
  let sqlParams;

  if (req.query.action == "add") {
    sql = "INSERT INTO favorites (imageURL, keyword) VALUES (?,?)";
    sqlParams = [req.query.imageURL, req.query.keyword];
  } else {
    sql="DELETE FROM favorites WHERE imageURL = ?";
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

app.get("/venus", function(req, res) {
  res.render("venus.html");
});

app.get("/earth", function(req, res) {
  res.render("earth.html");
});

app.get("/mars", function(req, res) {
  res.render("mars.html");
});

//server listener
app.listen(process.env.PORT || 8081, process.env.IP, function() {
  console.log("Express server is running...");
});

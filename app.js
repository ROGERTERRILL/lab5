const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");

//routes
app.get("/", function(req, res) {
  let url =
    "https://api.unsplash.com/photos/random?client_id=0a82899cb0939e4b3b34d2e48fd5efe94fdf18c54f2970941db6873f5280d45a&orientation=landscape";

  request(url, function(error, response, body) {
    // console.log("error", error);
    // console.log("statusCode", response && response.statusCode);
    // console.log("body", body);
    if (!error) {
      let parsedData = JSON.parse(body);
      let imageURL = parsedData.urls.regular;
      res.render("index", { imageURL: imageURL });
    } else {
      res.render("index", { error: "unable to access API" });
    }
  });
});

app.get("/search", function(req, res) {
  let keyword = req.query.keyword;
  getRandomImages_cb(keyword, 9, function(imageURLs) {
    console.log("imageURLs: " + imageURLs);
    res.render("results", { imageURLs: imageURLs });
  });
}); //search

function getRandomImages_cb(keyword, imageCount, callback) {
  let url = `https://api.unsplash.com/photos/random?query=${keyword}&count=${imageCount}&client_id=0a82899cb0939e4b3b34d2e48fd5efe94fdf18c54f2970941db6873f5280d45a&orientation=landscape`;
  request(url, function(error, response, body) {
    if (!error) {
      let parsedData = JSON.parse(body);
      let imageURLs = [];
      for (let i = 0; i < 9; i++) {
        imageURLs.push(parsedData[i].urls.regular);
      }
      callback(imageURLs);
    } else {
      console.log("error", error);
    }
  });
}

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

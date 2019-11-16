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
  console.log("imageURLs using promises: " + imageURLs);
  res.render("results", { imageURLs: imageURLs });

  // CALLBACK APPROACH
  // getRandomImages_cb(keyword, 9, function(imageURLs) {
  //   console.log("imageURLs: " + imageURLs);
  //   res.render("results", { imageURLs: imageURLs });

  // });
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

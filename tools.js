const request = require("request");

/**
 * Return random image URLs from an API
 * @param {string}  keyword       search term
 * @param {int}     imageCount    imageCount - number of random images
 * @return                        array of image URLS
 */

function getRandomImages(keyword, imageCount) {
  let url = `https://api.unsplash.com/photos/random?query=${keyword}&count=${imageCount}&client_id=0a82899cb0939e4b3b34d2e48fd5efe94fdf18c54f2970941db6873f5280d45a&orientation=landscape`;

  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (!error) {
        let parsedData = JSON.parse(body);
        let imageURLs = [];
        for (let i = 0; i < imageCount; i++) {
          imageURLs.push(parsedData[i].urls.regular);
        }

        resolve(imageURLs);
      } else {
        console.log("error", error);
      }
    });
  });
}

module.exports = { getRandomImages };

const reader = require("./reader.js");

// reader();

reader.getFavicon("yelp.com").then(function (image) {
  console.log("What's the image?", image);
});
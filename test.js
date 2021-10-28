const reader = require("./reader.js");

// reader();

reader.getFavicon("github.com").then(function (response) {
  // handle success
  console.log(response.data);
  
  if (typeof response.data.icons !== "undefined" && response.data.icons.length >= 1) {
    console.log(response.data.icons[0]["src"]);
    return response.data.icons[0]["src"];
  }
});
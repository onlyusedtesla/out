const fs = require('fs');
const { parse } = require('rss-to-json');

const rawData = fs.readFileSync(__dirname + '/data.json');
const data = JSON.parse(rawData);

parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  console.log("What's the rss from feedbin?", rss);
});


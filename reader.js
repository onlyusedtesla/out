const fs = require('fs');
const { parse } = require('rss-to-json');
const save = require('./db.js');
const striptags = require('striptags');

const rawData = fs.readFileSync(__dirname + '/data.json');
const data = JSON.parse(rawData);
parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  // save();
  console.log("What's the rss from feedbin?", rss);
  
  let items = rss.items.map(function (item) {
    item.url = item.link;
    item.description = striptags(item.description);
    item.link_type = "article";
    item.date = item.published;
    item.tags = "";
  });
  
  save(items);
  
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});


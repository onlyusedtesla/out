const { parse } = require('rss-to-json');
const db = require('./db.js');
const striptags = require('striptags');
const validKeys = db.keys;

parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  // save();
  console.log("What's the rss from feedbin?", rss);
  
  let items = rss.items.map(function (item) {
    item.url = item.link;
    item.description = striptags(item.description);
    item.link_type = "article";
    item.item_date = item.published;
    item.tags = "";
  });
  
  Object.keys(item).forEach((key) => validKeys.includes(key) || delete userInput[key]);
  
  save(items);
  
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});


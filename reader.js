const fs = require('fs');
const { parse } = require('rss-to-json');
const save = require('./db.js');
import { stripHtml } from "string-strip-html";

const rawData = fs.readFileSync(__dirname + '/data.json');
const data = JSON.parse(rawData);
parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  // save();
  console.log("What's the rss from feedbin?", rss);
  
  save(rss.items);
  
  let items = rss.items.map(function (item) {
    item.domain = item.link;
    item.description = item.
  });
  
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});


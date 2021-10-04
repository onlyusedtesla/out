const { parse } = require('rss-to-json');
const db = require('./db.js');
const striptags = require('striptags');
const validKeys = db.validKeys;

parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  
  let items = rss.items.map(function (item) {
    item.url = item.link;
    item.description = striptags(item.description);
    item.link_type = "article";
    item.item_date = item.published;
    item.tags = "";
    item.item_id = db.uuid();
    item.timestamp = Date.now();
    
    delete item.id;
    delete item.link;
    delete item.category
    delete item.content;
    delete item.enclosures;
    delete item.media;
    delete item.published;
    delete item.created;
    return item;
    
  });
  
  db.save(items);
  
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});


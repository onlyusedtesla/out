const { parse } = require('rss-to-json');
const db = require('./db.js');
const striptags = require('striptags');
const validKeys = db.validKeys;
const dateFormat = require("./dateFormat.js");
const rake = require('rake-js');

/*
 * @description - Takes an array of strings that are of different words. Some have 1 words, 2 words, 3 words, etc.
 * @return array of strings
 */
function getRelevantKeywords() {
  // Purpose of this function is to grab keywords
  // like grab all the ones that are of length 2...
  // if none then go to 3... 
  // if none then go to 1.
  // etc..
  
  // So what's the fastest way to do this?
  
  
}

parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
  
  let items = rss.items.map(function (item) {
    item.url = item.link;
    item.description = striptags(item.description).trim();
    item.link_type = "article";
    item.item_date = item.published;
    item.tags = "";
    item.item_id = db.uuid();
    item.timestamp = Date.now();
    item.domain = new URL(item.link).host.split("www.").join("");
    item.item_date_formatted = dateFormat(item.published, "mmm d, h:MM tt");
    item.description_trimmed = item.description.length > 280 ? item.description.substring(0, 280) + "..." : item.description;
    
    item.keywords = rake.default(item.title.trim() + " " + item.description, { language: 'english' });
    
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
  
  console.log("What are the items?", items);
  
  // db.save(items);
  
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});


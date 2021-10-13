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
function getRelevantKeywords(keywords) {
  // Purpose of this function is to grab keywords
  // like grab all the ones that are of length 2...
  // if none then go to 3... 
  // if none then go to 1.
  // etc..
  
  // So what's the fastest way to do this?
  
  let results = [];
  let index = [];
  
  for (let i = 0; i < keywords.length; i += 1) {
    if (keywords[i].split(" ").length === 2 && !index.includes(i)) {
      results.push(keywords[i]);
      index.push(i);
    }
    
    if (results.length === 4) {
      return results;
    }
    
  }
  
  return results;
  
}

function update(done) {
  parse("https://feedbin.com/starred/c5abfc079595d929aa9a1ef735cccd7b.xml").then(function (rss) {
    
  console.log("RSS", rss);
  
  let items = rss.items.map(function (item) {
    
    item.url = item.link;
    item.description = striptags(item.description).trim();
    item.link_type = "article";
    item.item_date = item.published;
    item.item_id = db.uuid();
    item.timestamp = Date.now();
    item.domain = new URL(item.link).host.split("www.").join("");
    item.item_date_formatted = dateFormat(item.published, "mmm d, h:MM tt");
    item.description_trimmed = item.description.length > 280 ? item.description.substring(0, 280) + "..." : item.description;
    
    let keywords = rake.default(item.title.trim() + " " + item.description, { language: 'english' });
    
    item.keywords = getRelevantKeywords(keywords).map(function (keyword) {
      let result = "";
      
      keyword.split(" ").forEach(function (k) {
        result += k[0].toUpperCase() + k.substring(1) + " ";
      });
      
      return result.trim();
    }).join(", ");
    
    delete item.id;
    delete item.link;
    delete item.category
    delete item.content;
    delete item.enclosures;
    delete item.media;
    delete item.published;
    delete item.created;
    
    return item;
    
  }).sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.item_date) - new Date(a.item_date);
  });
  
  db.save(items);
  done();
    
}).catch(function (error) {
  console.log("There's been an error");
  console.log("error", error);
});
}

module.exports = update;

update();
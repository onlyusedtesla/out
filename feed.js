const fs = require('fs');
const jsonfeedToRSS = require('jsonfeed-to-rss')

module.exports = function () {
  let rawData = fs.readFileSync(__dirname + '/submissions.json'),
      data = JSON.parse(rawData);
  
  let obj = {
  "version":"https://jsonfeed.org/version/1",
  "title":"bret.io log",
  "home_page_url":"https://jsonfeed-to-rss.netlify.com",
  "feed_url":"https://jsonfeed-to-rss.netlify.com/snapshots/readme-feed.json",
  "description": "A simple summary that describes the podcast.  It can have a few sentences.\n\nIf there is more than one paragraph, it gets truncated in some contexts.",
  "next_url":"https://jsonfeed-to-rss.netlify.com/snapshots/2017.json",
  "icon":"https://jsonfeed-to-rss.netlify.com/icon-512x512.png",
  "author":{
     "name":"Bret Comnes",
     "url":"https://bret.io",
     "avatar":"https://gravatar.com/avatar/8d8b82740cb7ca994449cccd1dfdef5f?size=512"
  },
  "_itunes":{
     "about":"https://github.com/bcomnes/jsonfeed-to-rss#itunes",
     "owner": {
       "email": "bcomnes@gmail.com"
     },
     "image": "https://jsonfeed-to-rss.netlify.com/icon-3000x3000.png",
     "category": "Sports & Recreation",
     "subcategory": "Outdoor"
  },
};
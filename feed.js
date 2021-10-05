const fs = require('fs');
const jsonfeedToRSS = require('jsonfeed-to-rss');

module.exports = function () {
  let rawData = fs.readFileSync(__dirname + '/submissions.json'),
      data = JSON.parse(rawData);
  
  let obj = {
    "version":"https://jsonfeed.org/version/1",
    "title":"TeslaTracker Submissions",
    "home_page_url":"https://teslatracker.com/",
    "feed_url":"https://teslatracker.com/submissions.xml",
    "description": "A feed that that provides access to the latest TeslaTracker submissions.",
    "icon":"https://cdn.glitch.com/d53aa53a-c591-4e03-8635-621cfc75b4fc%2Fandroid-chrome-192x192.png?v=1633025139630",
    "author":{
      "name":"TeslaTracker",
      "url":"https://teslatracker.com/",
      "avatar":"https://cdn.glitch.com/d53aa53a-c591-4e03-8635-621cfc75b4fc%2Fandroid-chrome-192x192.png?v=1633025139630"
    }
  };
  
  obj.items = data.submissions;
  
  return jsonfeedToRSS(obj)
}
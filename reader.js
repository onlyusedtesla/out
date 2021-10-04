const fs = require('fs');
const parser = require("fast-xml-parser");

const { parse } = require('rss-to-json');
// async await
(async () => {

    var rss = await parse('https://blog.ethereum.org/feed.xml');

    console.log(JSON.stringify(rss, null, 3));

})();

parse
const options = {
  hostname: 'feedbin.com',
  port: 443,
  path: '/starred/c5abfc079595d929aa9a1ef735cccd7b.xml',
  method: 'GET'
}

const rawData = fs.readFileSync(__dirname + '/data.json');
const data = JSON.parse(rawData);

//  if (res.headers.etag !== data.etag) {
   
//  }

console.log("What's the data?", data);

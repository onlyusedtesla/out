const https = require('https');
const fs = require('fs');
const parser = require("fast-xml-parser");

const options = {
  hostname: 'feedbin.com',
  port: 443,
  path: '/starred/c5abfc079595d929aa9a1ef735cccd7b.xml',
  method: 'GET'
}

const rawData = fs.readFileSync(__dirname + '/data.json');
const data = JSON.parse(rawData);

console.log("What's the data?", data);

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  
  console.log('res.headers', res.headers);
  
    res.on('data', d => {
      // const feed = parser.parse(d.toString());
      console.log("toString", d.toString());
      // console.log("What's the feed?", feed);
    });
  
//   // Only read the data if it's been modified
//   if (res.headers.etag !== data.etag) {
    
//     data.etag = res.headers.etag;
    
//     res.on('data', d => {
//       console.log("What's the data?", d);
//       process.stdout.write(d);
      
//       const feed = parser.parse(d);
//       console.log("What's the feed?", feed);
      
//     });
    
//     fs.writeFileSync(__dirname + '/data.json', JSON.stringify(data));
    
//   } else {
//     console.log("The etag is the same, so the data is the same don't read this file.");
//     console.log("etag", data.etag);
//   }
  
})

req.on('error', error => {
  console.error(error);
})

req.end();
const https = require('https');
const options = {
  hostname: 'feedbin.com',
  port: 443,
  path: '/starred/c5abfc079595d929aa9a1ef735cccd7b.xml',
  method: 'GET'
}

let etag = undefined;

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  
  console.log('res.headers', res.headers);
  
  // Only read the data if it's been modified
  if (res.headers.etag === etag) {
    res.on('data', d => {
      console.log("What's the data?", d);
      process.stdout.write(d);
    });
    
    
  } else {
    
  }
  
})

req.on('error', error => {
  console.error(error);
})

req.end();
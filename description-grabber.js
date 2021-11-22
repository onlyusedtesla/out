const request = require("request");
const API_KEY = "EvI6NaktcmTo2E4IBmDJ";

/*
 * @description - Converts a string into a base64 equivalent
 */
function base64(dataString) {
  return Buffer.from(dataString).toString('base64');
}

console.log("base64('derick.realwebdev+urlmeta@gmail.com:' + API_KEY)", base64('derick.realwebdev+urlmeta@gmail.com:' + API_KEY));

function grabMeta(url) {
  
  console.log('grabMeta');
  console.log('url', url);
  
  const options = {
    host: 'api.urlmeta.org',
    path: '/?url=' + url,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + base64('derick.realwebdev+urlmeta@gmail.com:' + API_KEY)
    }
  };
  
  https.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
  });
  
}

grabMeta('https://google.com/');
const https = require('https');

function makeRequest(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, (res) => {
      res.on('data', (d) => {
        resolve(d.toString());
      });

    }).on('error', (e) => {
      console.error(e);
      reject(e);
    });
  });
}

module.exports = makeRequest;
const request = require("request");
const API_KEY = "EvI6NaktcmTo2E4IBmDJ";
const base64Credentials = Buffer.from(
  "derick.realwebdev+urlmeta@gmail.com:" + API_KEY
).toString("base64");

module.exports = function(url, callback) {
  const options = {
    url: "https://api.urlmeta.org/?url=" + url,
    headers: {
      Authorization: "Basic " + base64Credentials
    }
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      if (data.result.status == "OK") {
        if (
          typeof data.meta.description !== "undefined" &&
          data.meta.description
        ) {
          callback(data.meta.description);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

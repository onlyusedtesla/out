const https = require("https");
const API_KEY = "EvI6NaktcmTo2E4IBmDJ";
const URL = "https://api.urlmeta.org/?url=";
/*
 * @description - Converts a string into a base64 equivalent
 */
function base64(dataString) {
  return new Buffer(dataString).toString('base64');
}

https.get();
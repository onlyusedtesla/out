const fs = require('fs');
const original = fs.readFileSync(__dirname + "/public/style.css").toString();
const regex = /--bg-color: (#\w{6})/
const settings = require('./settings.json');

let newFileText = original.replace(regex, function (match, p1, p2, p3, offset, string) {
  return "--bg-color: " + settings.backgroundColor;
});

console.log("newFileText", newFileText);

try {
  fs.writeFileSync(__dirname + "/public/style-transformed.css", newFileText);
  console.log("Successfully created the new file");
} catch {
  console.log("An error while creating the new file.");
}
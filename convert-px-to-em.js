const fs = require('fs');
const original = fs.readFileSync(__dirname + "/public/style-backup.css").toString();
const regex = /\d+px/g;

let newFile = original.replace(regex, function (match, p1, p2, p3, offset, string) {
  console.log("match", match);
  console.log("p1", p1);
  console.log("p2", p2);
  console.log("p3", p3);
  console.log("offset", offset);
  console.log("string", string);
});

// console.log("What's the new file?", newFile);
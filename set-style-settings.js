const fs = require('fs');
const original = fs.readFileSync(__dirname + "/public/style.css").toString();
const regex = /--bg-color: (#\w{6})/

let newFileText = original.replace(regex, function (match, p1, p2, p3, offset, string) {
  console.log("What's match?", match);
  console.log("p1", p1);
  console.log("p2", p2);
  console.log("p3", p3);
  console.log("offset", offset);
  console.log("string", string);
});

// try {
//   fs.writeFileSync(__dirname + "/style-ems.css", newFileText);
// } catch {
//   console.log("An error while creating the new file.");
// }

console.log("Successfully created the new file");
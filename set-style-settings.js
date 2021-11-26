const fs = require('fs');
const original = fs.readFileSync(__dirname + "/public/style.css").toString();
const regex = /--bg-color: (#E8F4EA)

let newFileText = original.replace(regex, function (match, p1, p2, p3, offset, string) {
  let val = +match.split("px")[0];
  if (val >= 1) {
    return (val / 16) + "em";
  }
});

try {
  fs.writeFileSync(__dirname + "/style-ems.css", newFileText);
} catch {
  console.log("An error while creating the new file.");
}

console.log("Successfully created the new file");
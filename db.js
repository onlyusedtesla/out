const fs = require('fs');
let rawData = fs.readFileSync(__dirname + '/data.json');
let data = JSON.parse(rawData);

const validKeys = ['title', 'description', 'url', 'item_id', 'tags', 'link_type', 'timestamp', 'item_date'];

function uuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function saveFile() {
  fs.writeFileSync("./data.json", JSON.stringify(data));
}

function save(items) {
  console.log("What are items?", items);
  data["items"] = items;
  saveFile(data);
}

function saveSubmission(submission) {
  rawData = fs.readFileSync(__dirname + '/submissions.json');
  data = JSON.parse(rawData);
  
  data.submissions = data.submissions || [];
  
  data.submissions.push(submission);
  
  try {
    fs.writeFileSync("./submissions.json", JSON.stringify(data));
    return "Submission Saved Successfully";
  } catch {
    return new Error("An error occured while saving the submission.");
  }
}

function getItems() {
  rawData = fs.readFileSync(__dirname + '/data.json');
  data = JSON.parse(rawData);
  return data["items"];
}

// function getItemsByDate(items) {
//   return items.filter(function (item) {
//     return item.timestamp.
//   });
// }

module.exports = {
  save: save,
  getItems: getItems,
  saveSubmission: saveSubmission,
  validKeys: validKeys,
  uuid: uuid
};
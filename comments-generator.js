const fs = require("fs");

let itemId = "0b914140";
let author = "Jack";
let contents = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis.";
let comment_date = "1635450631000";

let comments = [];

function uuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

for (let i = 0; i < 50; i += 1) {
  comments.push({
    item_id: itemId,
    author: author,
    contents: contents,
    comment_date: comment_date,
    comment_id: uuid()
  });
}

let commentIds = 
    
    {
      "comment_id": "81gbh",
      "item_id": "499jfjd",
      "replies": [5940, 45040, 40540504, 45405045]
    }
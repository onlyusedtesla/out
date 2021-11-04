const fs = require("fs");
const dateFormat = require('./public/dateFormat.js');

let itemId = "0b914140";
let author = "Jack";
let contents = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis.";
let comment_date = 1635450631000;
let comment_date_formatted = dateFormat(comment_date, "mmm d");
let comments = [];

function uuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function sentence() {
              var verbs, nouns, adjectives, adverbs, preposition;
            nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
            verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
            adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
            adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
            preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

            function randGen() {
              return Math.floor(Math.random() * 5);
            }
  
              var rand1 = Math.floor(Math.random() * 10);
              var rand2 = Math.floor(Math.random() * 10);
              var rand3 = Math.floor(Math.random() * 10);
              var rand4 = Math.floor(Math.random() * 10);
              var rand5 = Math.floor(Math.random() * 10);
              var rand6 = Math.floor(Math.random() * 10);
              //                var randCol = [rand1,rand2,rand3,rand4,rand5];
              //                var i = randGen();
              
              return "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
  
}

for (let i = 0; i < 50; i += 1) {
  comments.push({
    item_id: itemId,
    author: author,
    contents: sentence(),
    comment_date: comment_date,
    comment_date_formatted: comment_date_formatted,
    comment_id: uuid()
  });
}

for (let i = 0; i < 50; i += 1) {
  comments[i].parent_id = comments[Math.floor(Math.random() * comments.length)].comment_id
}

for (let i = 0; i < 10; i += 1) {
  comments[Math.floor(Math.random()*comments.length)].parent_id = null;
}

let data = {
  "comments": comments
}

fs.writeFileSync(__dirname + "/comments.json", JSON.stringify(data));

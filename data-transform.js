const data = require("./data.json");
const favorites = require("./favorites.json");
const upvotes = require("./upvotes.json");
const fs = require('fs');

console.log("Gonna transform some JSON files in here.");
console.log("What's data?", data);

data["user_favorites"] = favorites["favorites"];
data["user_upvotes"] = upvotes["upvotes"];

fs.writeFileSync("./data.json", JSON.stringify(data));

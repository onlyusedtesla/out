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
  data["items"].push(items);
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

function getAllItems() {
  rawData = fs.readFileSync(__dirname + '/data.json');
  data = JSON.parse(rawData);
  return data["items"];
}

/*
 * @description - Returns the items based on a number. 
 * @parameter page:number - 1 will return the first 10 items. 2 will return the second 10 items, 3 will return the 3rd 10 items.. until there are no more items... */
function getItems(page) {
  const items = getAllItems();
  console.log("What's the length?", items.length);
  
  page = page >= 0 ? page : 0;
  
  return items.slice(page * 10, (page * 10) + 10);
}

function getItemsFromSearch(searchTerm) {
  const allItems = getAllItems();
  
  let items = [];
  
  for (let i = 0; i < allItems.length; i += 1) {
    if (allItems[i].title.trim().toLowerCase().includes(searchTerm.toLowerCase()) || allItems[i].description.trim().toLowerCase().includes(searchTerm.toLowerCase())) {
      items.push(allItems[i]);
    }
  }
  
  return items;
  
}

function saveFavoritesFile(data) {
  try {
    fs.writeFileSync("./favorites.json", JSON.stringify(data));
    return "Success";
  } catch {
    throw new Error("There was an error while writing to the favorites.json file.");
  }
}

function addFavorite(userId, articleId) {
  const rawData = fs.readFileSync(__dirname + '/favorites.json');
  let data = JSON.parse(rawData);
  
  if (typeof data["favorites"][userId] === "undefined") {
    data["favorites"][userId] = [];
  }
  
  if (!data["favorites"][userId].some(function (el) {
    el.article_id === articleId
  })) {
    data["favorites"][userId].push({
      article_id: articleId,
      favorite_date: Date.now()
    });
  }
  
  return saveFavoritesFile(data);
  
}

module.exports = {
  save: save,
  getItems: getItems,
  getAllItems: getAllItems,
  getItemsFromSearch: getItemsFromSearch,
  
  addFavorite: addFavorite,
  
  saveSubmission: saveSubmission,
  validKeys: validKeys,
  uuid: uuid
};
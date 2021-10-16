const fs = require('fs');
let rawData = fs.readFileSync(__dirname + '/data.json');
let data = JSON.parse(rawData);
const tables = ['favorites', 'upvotes'];
const validKeys = ['title', 'description', 'url', 'item_id', 'tags', 'link_type', 'timestamp', 'item_date'];

function uuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function saveSpecificFile(fileName, data) {
  const fname = fileName.toLowerCase();
  fs.writeFileSync("./" + fname + ".json", JSON.stringify(data));
}

function saveFile() {
  return saveSpecificFile("data", data);
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

function getAllItems() {
  rawData = fs.readFileSync(__dirname + '/data.json');
  data = JSON.parse(rawData);
  return data["items"];
}

function itemExists(itemId) {
  let results = getAllItems().some(el => el.item_id === itemId);
  console.log("itemExists results?", results);
  return results;
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
  return saveSpecificFile("favorites", data);
}

/*
 * @description - TODO: I'll change the name of this func later.
 * @return Void
 */
function addFavoriteOrUpvote(tableName, userId, itemId) {
    const rawData = fs.readFileSync(__dirname + '/' + tableName + '.json');
  let data = JSON.parse(rawData);
  
  if (!tables.includes(tableName)) {
    return new Error("Please make sure you use the correct table name " + tables.join(" "));
  }
  
  if (typeof data[tableName][userId] === "undefined") {
    data[tableName][userId] = [];
  }
  
  if (!data[tableName][userId].some(function (el) {
    return el.item_id === itemId
  })) {
    data[tableName][userId].push({
      item_id: itemId,
      action_date: Date.now()
    });
  }
  
  return saveSpecificFile(tableName, data);
}

function removeFavoriteOrUpvote(tableName, userId, itemId) {
  
  if (!tables.includes(tableName)) {
    return new Error("Please specify the correct table.");
  }
  
  const rawData = fs.readFileSync(__dirname + '/' + tableName + '.json');
  let data = JSON.parse(rawData);
  
  if (typeof data[tableName][userId] === "undefined") {
    return false;
  }
  
  if (data[tableName][userId].some(function (el) {
    return el.item_id === itemId
  })) {
    let index = data[tableName][userId].findIndex(i => i.item_id === itemId);
    data[tableName][userId].splice(index, 1);
  } else {
    return false;
  }
  
  return saveSpecificFile(tableName, data);
}

/*
 * @description - Gets all favorits for a specific user id.
 */
function getFavorites(userId) {
  return getFavoritesOrUpvotes('favorites', userId);
}

function getUpvotes(userId) {
  return getFavoritesOrUpvotes('upvotes', userId);
}

function getFavoritesOrUpvotes(tableName, userId) {
  let rawData = fs.readFileSync(__dirname + `/${tableName}.json`);
  let data = JSON.parse(rawData);
  
  if (typeof data[tableName][userId] !== "undefined") {
    return data[tableName][userId];
  } else {
    return [];
  }
}

function removeFavorite(userId, itemId) {
  return removeFavoriteOrUpvote('favorites', userId, itemId);
}

function addFavorite(userId, itemId) {
  return addFavoriteOrUpvote('favorites', userId, itemId);
}

function addUpvote(userId, itemId) {
  return addFavoriteOrUpvote('upvotes', userId, itemId);
}

function removeUpvote(userId, itemId) {
  removeFavoriteOrUpvote('favorites', userId, itemId);
}

module.exports = {
  save: save,
  getItems: getItems,
  getAllItems: getAllItems,
  getItemsFromSearch: getItemsFromSearch,
  itemExists: itemExists,
  
  addFavorite: addFavorite,
  getFavorites: getFavorites,
  removeFavorite: removeFavorite,
  
  addUpvote: addUpvote,
  removeUpvote: removeUpvote,
  getUpvotes: getUpvotes,
  
  saveSubmission: saveSubmission,
  validKeys: validKeys,
  uuid: uuid
};
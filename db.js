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

function saveFile(data) {
  fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data));
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
  return results;
}

/*
 * @description - Returns the items based on a number. 
 * @parameter page:number - 1 will return the first 10 items. 2 will return the second 10 items, 3 will return the 3rd 10 items.. until there are no more items... */
function getItems(page) {
  const items = getAllItems();
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

/*
 * @description - TODO: I'll change the name of this func later.
 * @return Void
 */
function addFavoriteOrUpvote(tableName, userId, itemId) {
  const rawData = fs.readFileSync(__dirname + '/data.json');
  let data = JSON.parse(rawData);
  
  if (typeof data['user_' + tableName][userId] === "undefined") {
    data['user_' + tableName][userId] = [];
  }
  
  if (!data['user_' + tableName][userId].some(function (el) {
    return el.item_id === itemId
  })) {
    
    console.log("I'm gonna push the thing up to the table");
    console.log("tableName", tableName);
    console.log("userId", userId);
    
    data['user_' + tableName][userId].push({
      item_id: itemId,
      action_date: Date.now()
    });
    
    // Add upvotes to the table name to be able to render it later.
    if (tableName === 'upvotes') {
      if (typeof data['item_upvotes'][itemId] === "undefined") {
        data['item_upvotes'][itemId] = {};
      }
      
      data['item_upvotes'][itemId][userId] = true;
      
    }
    
  }
  
  saveFile(data);
  
}

function removeFavoriteOrUpvote(tableName, userId, itemId) {
  
  if (!tables.includes(tableName)) {
    return new Error("Please specify the correct table.");
  }
  
  const rawData = fs.readFileSync(__dirname + '/' + tableName + '.json');
  let data = JSON.parse(rawData);
  
  if (typeof data['user_' + tableName][userId] === "undefined") {
    return false;
  }
  
  if (data['user_' + tableName][userId].some(function (el) {
    return el.item_id === itemId
  })) {
    let index = data['user_' + tableName][userId].findIndex(i => i.item_id === itemId);
    data['user_' + tableName][userId].splice(index, 1);
    
    // Go ahead and remove the userkey frrom the item_upvotes too.
    if (tableName === 'upvotes') {
      delete data['item_upvotes'][itemId][userId];
    }
  } else {
    return false;
  }

  
  saveFile(data);
  
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

/*
 * @description - Returns the number of upvotes for a specific item
 * @return Number
 */
function getUpvoteCountForItem(itemId) {
  let rawData = fs.readFileSync(__dirname + '/data.json');
  let data = JSON.parse(rawData);
  
  let result = undefined;
  
  // All items by default have 1 vote by default when it's created.
  if (typeof data['item_upvotes'][itemId] === "undefined") {
    result = 1; 
  } else {
    result = Object.keys(data['item_upvotes'][itemId]).length + 1;
  }
  
  return result;
  
}

function getFavoritesOrUpvotes(tableName, userId) {
  let rawData = fs.readFileSync(__dirname + '/data.json');
  let data = JSON.parse(rawData);
  
  if (typeof data['user_' + tableName][userId] !== "undefined") {
    return data['user_' + tableName][userId];
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
  return removeFavoriteOrUpvote('favorites', userId, itemId);
}

module.exports = {

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
  getUpvoteCountForItem: getUpvoteCountForItem,
  
  saveSubmission: saveSubmission,
  validKeys: validKeys,
  uuid: uuid
};
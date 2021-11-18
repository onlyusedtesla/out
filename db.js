const fs = require("fs");
const dbFileName = process.env.STAGING ? "data-staging.json" : "data.json";
const submissionsFileName = process.env.STAGING
  ? "submissions-staging.json"
  : "submissions.json";

const tables = ["favorites", "upvotes"];
const validKeys = [
  "title",
  "description",
  "url",
  "item_id",
  "tags",
  "link_type",
  "timestamp",
  "item_date"
];

// Check if the files exist and if they don't create them.

if (!fs.existsSync(__dirname + "/" + dbFileName)) {
  let data = {
    items: [],
    item_upvotes: {},
    user_favorites: {},
    user_upvotes: {},
    invite_codes: {},
    comments: [],
    users: {}
  };

  fs.writeFileSync(__dirname + "/" + dbFileName, JSON.stringify(data));
}

if (!fs.existsSync(__dirname + "/" + submissionsFileName)) {
  let data = {
    submissions: []
  };
  fs.writeFileSync(__dirname + "/" + submissionsFileName, JSON.stringify(data));
}

function uuid() {
  return "xxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function saveFile(data) {
  fs.writeFileSync(__dirname + "/" + dbFileName, JSON.stringify(data));
}

function save(items) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  data["items"] = data["items"].concat(items);
  saveFile(data);
}

function backupData() {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  fs.writeFileSync(
    __dirname +
      (process.env.staging
        ? "/backups/data-staging-backup-"
        : "/backups/data-backup") +
      new Date().getTime() +
      ".json",
    JSON.stringify(data)
  );
}

function backupSubmissions() {
  let rawData = fs.readFileSync(__dirname + "/submissions.json");
  let data = JSON.parse(rawData);
  fs.writeFileSync(
    __dirname +
      (process.env.staging
        ? "/backups/submissions-staging-backup-"
        : "/backups/submissions-backup-") +
      new Date().getTime() +
      ".json",
    JSON.stringify(data)
  );
}

function findSubmission(submission) {
  const rawData = fs.readFileSync(__dirname + "/" + submissionsFileName),
    data = JSON.parse(rawData),
    allSubmissions = data["submissions"],
    indexOfSubmission = allSubmissions.findIndex(
      i => i.title === submission.title && i.url === submission.url
    );
  return allSubmissions[indexOfSubmission];
}

function saveSubmission(submission) {
  let rawData = fs.readFileSync(__dirname + "/" + submissionsFileName);
  let data = JSON.parse(rawData);

  data.submissions = data.submissions || [];
  data.submissions.push(submission);

  try {
    backupSubmissions();
    fs.writeFileSync(
      __dirname + "/" + submissionsFileName,
      JSON.stringify(data)
    );
    return "Submission Saved Successfully";
  } catch {
    return new Error("An error occured while saving the submission.");
  }
}

function getAllItems() {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  return data["items"];
}

function itemExists(itemId) {
  let results = getAllItems().some(el => el.item_id === itemId);
  return results;
}

/*
 * @description - Returns the items based on a number.
 * - Used for AJAX calls from the home page's more button.
 * @parameter page:number - 1 will return the first 10 items. 2 will return the second 10 items, 3 will return the 3rd 10 items.. until there are no more items... */
function getItems(page) {
  const items = getAllItems();
  page = page >= 0 ? page : 0;
  return items.slice(page * 10, page * 10 + 10);
}

/*
 * @description - Returns an individual item based on an id.
 * - Used for when rendering the item contents on the /item page.
 * @parameter itemId:String
 */
function getItem(itemId) {
  if (itemExists(itemId)) {
    return getAllItems().filter(el => el.item_id === itemId)[0];
  } else {
    return null;
  }
}

function getItemsFromSearch(searchTerm) {
  const allItems = getAllItems();

  let items = [];

  for (let i = 0; i < allItems.length; i += 1) {
    if (
      allItems[i].title
        .trim()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      allItems[i].description
        .trim()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
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
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  if (typeof data["user_" + tableName][userId] === "undefined") {
    data["user_" + tableName][userId] = [];
  }

  if (
    !data["user_" + tableName][userId].some(function(el) {
      return el.item_id === itemId;
    })
  ) {
    console.log("I'm gonna push the thing up to the table");
    console.log("tableName", tableName);
    console.log("userId", userId);

    data["user_" + tableName][userId].push({
      item_id: itemId,
      action_date: Date.now()
    });

    // Add upvotes to the table name to be able to render it later.
    if (tableName === "upvotes") {
      if (typeof data["item_upvotes"][itemId] === "undefined") {
        data["item_upvotes"][itemId] = {};
      }

      data["item_upvotes"][itemId][userId] = true;
    }
  }

  saveFile(data);
}

function removeFavoriteOrUpvote(tableName, userId, itemId) {
  if (!tables.includes(tableName)) {
    return new Error("Please specify the correct table.");
  }

  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  if (typeof data["user_" + tableName][userId] === "undefined") {
    return false;
  }

  console.log(
    "data['user_' + tableName][userId]",
    data["user_" + tableName][userId]
  );

  if (
    data["user_" + tableName][userId].some(function(el) {
      return el.item_id === itemId;
    })
  ) {
    console.log("About to delete the thing.");
    console.log("tableName", tableName);

    let index = data["user_" + tableName][userId].findIndex(
      i => i.item_id === itemId
    );
    data["user_" + tableName][userId].splice(index, 1);

    // Go ahead and remove the userkey frrom the item_upvotes too.
    if (tableName === "upvotes") {
      delete data["item_upvotes"][itemId][userId];
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
  return getFavoritesOrUpvotes("favorites", userId);
}

function getUpvotes(userId) {
  return getFavoritesOrUpvotes("upvotes", userId);
}

function getSubmissions(nickname) {
  return getAllItems().filter(el => el.submitted_by === nickname);
}

/*
 * @description - Returns the number of upvotes for a specific item
 * @return Number
 */
function getUpvoteCountForItem(itemId) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  let result = undefined;

  // All items by default have 1 vote by default when it's created.
  if (typeof data["item_upvotes"][itemId] === "undefined") {
    result = 1;
  } else {
    result = Object.keys(data["item_upvotes"][itemId]).length + 1;
  }

  return result;
}

function getFavoritesOrUpvotes(tableName, userId) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  if (typeof data["user_" + tableName][userId] !== "undefined") {
    return data["user_" + tableName][userId];
  } else {
    return [];
  }
}

function removeFavorite(userId, itemId) {
  return removeFavoriteOrUpvote("favorites", userId, itemId);
}

function addFavorite(userId, itemId) {
  return addFavoriteOrUpvote("favorites", userId, itemId);
}

function addUpvote(userId, itemId) {
  return addFavoriteOrUpvote("upvotes", userId, itemId);
}

function removeUpvote(userId, itemId) {
  return removeFavoriteOrUpvote("upvotes", userId, itemId);
}

function getComments(itemId) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  let allCommentsForItem = data["comments"].filter(i => i.item_id === itemId);
  let commentMap = {};

  allCommentsForItem.forEach(
    comment => (commentMap[comment.comment_id] = comment)
  );

  allCommentsForItem.forEach(comment => {
    if (comment.parent_id !== null && comment.parent_id !== "null") {
      let parent = commentMap[comment.parent_id];
      (parent.replies = parent.replies || []).push(comment);
    }
  });

  return allCommentsForItem.filter(comment => {
    return comment.parent_id === null || comment.parent_id === "null";
  });
}

function addComment(comment) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  let commentId = uuid();
  comment.comment_id = commentId;

  data["comments"].push(comment);

  try {
    saveFile(data);
    return commentId;
  } catch {
    return false;
  }
}

/*
 * @description - Returns the number of comments for a specific item
 * @return Number
 */
function getCommentCountForItem(itemId) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  return data["comments"].filter(i => i.item_id === itemId).length;
}

/*
 * @description - Checks to see if a user profile exists, if not, then it creates a new one.
 * @param user:Object - an object with all the user information.
 */

function saveUserProfile(user) {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);

  if (typeof data["users"][user.nickname] === "undefined") {
    data["users"][user.nickname] = user;
    saveFile(data);

    try {
      saveFile(data);
      return true;
    } catch {
      return false;
    }
  }
}

/*
 * @description - This one is meant to be used in the user profile page to display the comments in a flat structure.
 * @param userId:String - The user id to get the comments for.
 */
function getCommentsForProfile(userId) {
  let rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  console.log("What are the comments?");
  console.log(data["comments"]);
  return data["comments"].filter(i => i.author === userId && itemExists(i.item_id));
}

/*
 * @description - What this one does is gets the actual items that have been favorited by a specific user.
 */
function getFavoritesForProfile(userId) {
  let favorites = getFavorites(userId);
  let items = [];
  
  for (let i = 0; i < favorites.length; i += 1) {
    items.push(getItem(favorites[i].item_id));
  }
  
  return items.filter(el => el !== null);
}

/*
 * @description - This one gets the items that have been favorited by a specific user.
 */
function getUpvotesForProfile(userId) {
  let upvotes = getUpvotes(userId);
  let items = [];
  
  for (let i = 0; i < upvotes.length; i += 1) {
    items.push(getItem(upvotes[i].item_id));
  }
  
  return items.filter(el => el !== null);
}

/*
 * @description - Update an existing user's profile
 * @param user:Object - An object with various params related to the user.
 */
function updateUserProfile(user) {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  
  if (typeof data["users"][user.author] !== "undefined") {
    data["users"][user.author].about = user.about;
    data["users"][user.author].ownedTeslaModel = user.ownedTeslaModel;
    
    if (data["users"][user.author].ownedTeslaModel === "I don't own a Tesla, yet.") {
      delete data["users"][user.author].ownedTeslaModel;
    }
    
    console.log('user.inviteCode && user.inviteCode.length >= 1 && typeof data["users"][user.author].invited_by === "undefined"', user.inviteCode && user.inviteCode.length >= 1 && typeof data["users"][user.author].invited_by === "undefined");
    
    // Do some checks for the invite code here
    // Set an invited_by property on the user and if it's exists then you will 
    if (user.inviteCode && user.inviteCode.length >= 1 && typeof data["users"][user.author].invited_by === "undefined") {
      data["users"][user.author].invited_by = setInviteForUser(user.inviteCode, user.author);
    }
    
    try {
      saveFile(data);
      return true;
    } catch {
      return false;
    }
  }
  
}

function findUser(userId) {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  return data["users"][userId];
}

/*
 * @description - Generates an N amount of invitation codes.
 * @n:Integer - A positive integer of the number of codes to generate.
 */
function generateInviteCodes(n, username) {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  
  n = n || 1;
  
  // Creating the key if it doesn't yet exist.
  if (typeof data["invite_codes"] === "undefined") {
    data["invite_codes"] = {}; 
  }
  
  for (let i = 0; i < n; i += 1) {
    data["invite_codes"][uuid() + "-" + uuid()] = {
      generated_by: username || null,
      accepted_by: null
    }
  }
  
  saveFile(data);
}

/*
 * @description - Get all unused invitation codes.
 */
function getInviteCodes() {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  
  return Object.keys(data["invite_codes"]).filter(el => data["invite_codes"][el].accepted_by === null);
}

function setInviteForUser(inviteCode, acceptedByUsername) {
  const rawData = fs.readFileSync(__dirname + "/" + dbFileName);
  let data = JSON.parse(rawData);
  
  console.log("What's the invite code?", inviteCode);
  console.log("What's the acceptedByUsername?", acceptedByUsername);
  console.log('data["invite_codes"][inviteCode].accepted_by', data["invite_codes"][inviteCode].accepted_by)
  console.log('data["invite_codes"][inviteCode].accepted_by == null', data["invite_codes"][inviteCode].accepted_by == null);
  
  if (typeof data["invite_codes"][inviteCode] !== "undefined" && data["invite_codes"][inviteCode].accepted_by == null) {
    data["invite_codes"][inviteCode].accepted_by = acceptedByUsername;
    
    try {
      saveFile(data);
      return data["invite_codes"][inviteCode].generated_by;
    } catch {
      return false;
    }
    
  } else {
    return false;
  }
}

module.exports = {
  save: save,
  getItems: getItems,
  getItem: getItem,
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

  getComments: getComments,
  addComment: addComment,
  getCommentCountForItem: getCommentCountForItem,
  
  saveSubmission: saveSubmission,
  findSubmission: findSubmission,
  getSubmissions: getSubmissions,
  validKeys: validKeys,
  uuid: uuid,

  saveUserProfile: saveUserProfile,
  updateUserProfile: updateUserProfile,
  findUser: findUser,
  
  getCommentsForProfile: getCommentsForProfile,
  getFavoritesForProfile: getFavoritesForProfile,
  getUpvotesForProfile: getUpvotesForProfile,
  
  generateInviteCodes: generateInviteCodes,
  getInviteCodes: getInviteCodes,
  setInviteForUser: setInviteForUser,
  
  backupData: backupData,
  backupSubmissions: backupSubmissions
};

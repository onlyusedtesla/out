const db = require('better-sqlite3')('teslatracker.db');

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

function saveItem(items) {
  
}

function save(items) {
  console.log("What are items?", items);
  data["items"] = items;
  saveFile(data);
}

function insert(table, items) {
  const sql = `INSERT INTO ${table} (link, title, description, pubDate, author, content_html) VALUES (@link, @title, @description, @pubDate, @author, @content_html)`;
  const insert = db.prepare(sql);
  
  if (typeof items.length === "undefined") {
    items = [items];
  }
  
  const insertItems = db.transaction((items) => {
    for (const item of items) {
      const info = insert.run(item);
      console.log("Just inserted the " + table === "submissions" ? "submission" : "item", item);
    }
  });
  
  insertItems(items);
}

function insertItems(table, items) {
  insert("items", items);
}

function insertSubmissions(table, submissions) {
  insert("submissions", submissions);
}

function saveSubmission(submission) {
  insertSubmissions(submission);
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

module.exports = {
  save: save,
  getItems: getItems,
  getItemsFromSearch: getItemsFromSearch,
  saveSubmission: saveSubmission,
  validKeys: validKeys,
  uuid: uuid
};
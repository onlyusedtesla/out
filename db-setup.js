// The goal here is to transfer all the stuff into a SQLite way of saving, rather than using JSON files.

// So the first thing that I need to do is to create two tables with the various columns, and then go through each of the 

const db = require('better-sqlite3')('teslatracker.db');
const fs = require('fs');
const reader = require('./reader.js');

function createItemsTable() {
  
  console.log("Creating the items table.");
  
  const sql = 
        `CREATE TABLE IF NOT EXISTS items (
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          author TEXT NOT NULL,
          url TEXT NOT NULL,
          link_type TEXT NOT NULL,
          item_date DATETIME NOT NULL,
          item_id TEXT NOT NULL PRIMARY KEY,
          timestamp DATETIME NOT NULL,
          domain TEXT NOT NULL,
          item_date_formatted TEXT NOT NULL,
          description_trimmed TEXT NOT NULL,
          keywords TEXT NOT NULL
        )`;
  
  const row = db.prepare(sql);
  const info = row.run();
  
  console.log("What's the info?", info);
}

function createSubmissionsTable() {
  
  console.log("Creating the submissions table.");
  
    const sql = 
        `CREATE TABLE IF NOT EXISTS submissions (
          link TEXT,
          title TEXT NOT NULL,
          description TEXT,
          pubDate DATETIME NOT NULL,
          author TEXT NOT NULL,
          content_html TEXT NOT NULL
        )`;
  
  const row = db.prepare(sql);
  const info = row.run();
  
  console.log("What's the info?", info);
}

function addExistingItems() {
  let rawData = fs.readFileSync(__dirname + '/data.json');
  let data = JSON.parse(rawData);
  
  const sql = `INSERT INTO items (title, description, author, url, link_type, item_date, item_id, timestamp, domain, item_date_formatted, description_trimmed, keywords) VALUES (@title, @description, @author, @url, @link_type, @item_date, @item_id, @timestamp, @domain, @item_date_formatted, @description_trimmed, @keywords)`;
  
  const insert = db.prepare(sql);
  
  const insertItems = db.transaction((items) => {
    for (const item of items) {
      const info = insert.run(item);
      console.log("Just inserted the item", item);
    }
  });
  
  insertItems(data.items);
}

function addExistingSubmissions() {
  let rawData = fs.readFileSync(__dirname + '/submissions.json');
  let data = JSON.parse(rawData);
  
  const sql = `INSERT INTO submissions (link, title, description, pubDate, author, content_html) VALUES (@link, @title, @description, @pubDate, @author, @content_html)`;
  const insert = db.prepare(sql);
  
  const insertItems = db.transaction((items) => {
    for (const item of items) {
      const info = insert.run(item);
      console.log("Just inserted the submissions", item);
    }
  });
  
  insertItems(data.submissions);
}

function addGuidColumnToItemsTable() {
  const sql = `ALTER TABLE items ADD COLUMN guid TEXT`;
  const insert = db.prepare(sql);
  const info = insert.run();
}

// db.prepare('DROP TABLE items').run();
// createItemsTable();
// createSubmissionsTable();
// addExistingItems();
// addExistingSubmissions();
// addGuidColumnToItemsTable();

reader();
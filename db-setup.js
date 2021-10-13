// The goal here is to transfer all the stuff into a SQLite way of saving, rather than using JSON files.

// So the first thing that I need to do is to create two tables with the various columns, and then go through each of the 

const db = require('better-sqlite3')('teslatracker.db');

function createItemsTable() {
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
  
}

function addExistingItems() {
  
}

function addExistingSubmissions() {
  
}

createItemsTable();
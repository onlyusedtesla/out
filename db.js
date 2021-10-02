const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });

const stmt = db.prepare("CREATE TABLE IF NOT EXISTS items('title' VARCHAR, 'description' VARCHAR, 'url' VARCHAR, 'item_id' INTEGER PRIMARY KEY AUTOINCREMENT, 'tags' VARCHAR, 'link_type' VARCHAR, 'timestamp' DEFAULT CURRENT_TIMESTAMP, 'item_date' VARCHAR)");
const info = stmt.run();

const stmt2 = db.prepare('INSERT INTO items (title, description, url, domain, date, tags, link_type) VALUES (@title, @description, @url, @domain, @date, @tags, @link_type)');

const items = [{
  title: 
}];
  
  
console.log(info); // => 1
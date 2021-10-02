const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });

const stmt = db.prepare('INSERT INTO cats (name, age) VALUES (?, ?)');
const info = stmt.run('Joey', 2);

console.log(info.changes); // => 1

db.prepare("CREATE TABLE IF NOT EXISTS items('title' VARCHAR, 'description' VARCHAR, 'url' VARCHAR, 'item_id' INTEGER PRIMARY KEY AUTOINCREMENT, 'tags' VARCHAR, 'link_type' VARCHAR, 'timestamp' DEFAULT CURRENT_TIMESTAMP, 'item_date' VARCHAR)");

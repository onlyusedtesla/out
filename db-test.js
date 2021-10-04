const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });

const items = db.prepare('SELECT * FROM items').all();

console.log("items", items);

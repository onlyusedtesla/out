const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });

const stmt = db.prepare("PRAGMA table_info(items)");
stmt.run();

function save(items) {
  const insert = db.prepare('INSERT INTO items (title, description, url, date, tags, link_type) VALUES (@title, @description, @url, @date, @tags, @link_type)');
  
  db.transaction(function (items) {
    for (let i = 0; i < items.length; i += 1) {
      insert.run(items[i]);
    }
  });
}

module.exports = save;
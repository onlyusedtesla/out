const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });

function save(items) {
  const insert = db.prepare('INSERT INTO items (title, description, url, item_date, tags, link_type) VALUES (@title, @description, @url, @item_date, @tags, @link_type)');
  
  db.transaction(function (items) {
    for (let i = 0; i < items.length; i += 1) {
      insert.run(items[i]);
    }
  });
}

module.exports = save;
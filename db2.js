// The goal here is to transfer all the stuff into a SQLite way of saving, rather than using JSON files.

// So the first thing that I need to do is to create two tables with the various columns, and then go through each of the 
// 
const db = require('better-sqlite3')('foobar.db', options);

const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
console.log(row.firstName, row.lastName, row.email);
const Database = require('better-sqlite3');
const db = new Database('teslatracker.db', { verbose: console.log });
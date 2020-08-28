const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(':memory', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory Sqlite db');
});

db.run('create table users(name text');

db.run('')

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection');
})


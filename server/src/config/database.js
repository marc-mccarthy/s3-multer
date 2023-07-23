// db.js

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'aws-file-upload-patterns'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	password: 'admin',
	host: 'localhost',
	database: 'aws-file-upload-patterns',
	port: 5432,
});

module.exports = pool;

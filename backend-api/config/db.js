const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user_pfe',
  password: process.env.DB_PASSWORD || 'user_password',
  database: process.env.DB_NAME || 'PFE-database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const promisePool = pool.promise();

console.log(' MySQL Pool Created (Connecting to PFE-database...)');

module.exports = promisePool;
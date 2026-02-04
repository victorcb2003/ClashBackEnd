require('dotenv').config({ quiet: true });
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,

  multipleStatements : true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000
});

module.exports = pool;
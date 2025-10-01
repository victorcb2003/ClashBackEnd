require('dotenv').config({ quiet: true });
const mysql = require('mysql2');

module.exports = function dbConnection(multipleStatements = false) {
  const connection =  mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    port: 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: multipleStatements
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
  });

  return connection;
};
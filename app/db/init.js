const mysql = require('mysql2');
const fs = require('fs');
const dbConnection = require('./connection');

const connection = dbConnection(true);

module.exports = function iniDb() {
  const sql = fs.readFileSync('./app/db/init.sql', 'utf8');
  connection.query(sql, (err) => {
    if (err) {
      console.error("Erreur lors de l'initialisation de la base de données:", err);
    } else {
      console.log('Base de données initialisée avec succès');
    }
  });
}
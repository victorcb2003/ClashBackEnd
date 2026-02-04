const mysql = require('mysql2');
const fs = require('fs');
const pool = require('./connection');

module.exports = function iniDb() {
  const sql = fs.readFileSync('./app/db/init.sql', 'utf8');
  pool.query(sql, (err) => {
    if (err) {
      console.error("Erreur lors de l'initialisation de la base de données:", err);
    } else {
      console.log('Base de données initialisée avec succès');
    }
  });
}
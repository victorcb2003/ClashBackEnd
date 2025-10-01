const jwt = require('jsonwebtoken');
require('dotenv').config({ quiet: true });
const dbconnection = require('../db/connection');

module.exports = class Token {

  // génére un token d'accès
  static generateToken(id) {
    return jwt.sign( id , process.env.TOKEN_SECRET, { expiresIn: '1h' });
  }

  // vérifie un token d'accès
  static verifyToken(token , res) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      res.status(401).send({"message": "Token invalide"});
      return false;
    }
  }
}

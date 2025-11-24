const jwt = require('jsonwebtoken');
require('dotenv').config({ quiet: true });
const dbconnection = require('../db/connection');

module.exports = class Token {

  // génére un token d'accès
  static generateToken(id, t = '1h') {
    return jwt.sign( id , process.env.TOKEN_SECRET, { expiresIn: t });
  }

  // vérifie un token d'accès
  static verifyToken(token , req) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      return false;
    }
  }
}

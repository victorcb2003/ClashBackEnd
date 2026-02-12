const User = require("./user.class.js");
const pool = require('../db/connection');

module.exports = class Organisateur extends User {
    constructor(prenom, nom, email, password) {
        super(prenom, nom, email, password);
    }
    static findAll(req, res) {
        

        const sql = "SELECT User.id, User.prenom, User.nom from User Join Organisateurs On Organisateurs.User_id = User.id"

        pool.execute(sql, (err, results, fields) => {
            if (err) {
                res.status(500).send({ error: "Erreur dans la requête " + err.message })
            }
            res.status(200).send({ Organisateurs: results })
        })
    }
};
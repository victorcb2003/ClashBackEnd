const User = require("./user.class.js");
const pool = require('../db/connection');

module.exports = class Selectionneur extends User {
    constructor(prenom, nom, email, password) {
        super(prenom, nom, email, password);
    }
    static findAll(req, res) {
        

        const sql = "SELECT User.id, User.prenom, User.nom from User Join Selectionneurs On Selectionneurs.User_id = User.id"

        pool.execute(sql, (err, results, fields) => {
            if (err) {
                res.status(401).send({ message: "Erreur dans la requête " + err.message })
            }
            res.status(200).send({ Selectionneurs: results })
        })
    }
};

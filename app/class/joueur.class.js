const User = require("./user.class.js");
const dbconnection = require('../db/connection');

module.exports = class Joueur extends User {
    constructor(prenom, nom, email, password) {
        super(prenom, nom, email, password);
    }

    static findAll(req,res){
        const connection = dbconnection()

        const sql = "SELECT User.id, User.prenom, User.nom from User Join Joueurs On Joueurs.User_id = User.id"

        connection.execute(sql, (err, results, fields)=>{
            if (err){
                res.status(401).send({message : "Erreur dans la requête "+err.message})
            }
            res.status(200).send({users : results})
        })
    }
};


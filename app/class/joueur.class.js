const User = require("./user.class.js");
const pool = require('../db/connection');

module.exports = class Joueur extends User {
    constructor(prenom, nom, email, password) {
        super(prenom, nom, email, password);
    }

    static findAll(req,res){
        

        const sql = "SELECT User.id, User.prenom, User.nom, Joueurs.Equipe_id from User Join Joueurs On Joueurs.User_id = User.id"

        pool.execute(sql, (err, results, fields)=>{
            if (err){
                res.status(500).send({error : "Erreur dans la requête "+err.message})
            }
            res.status(200).send({Joueurs : results})
        })
    }
    static setPendingEquipe(req,res){
        const sql = "UPDATE Joueurs SET Pending_Equipe = ? WHERE User_id = ?"
        const values = [req.body.Equipe_id, req.tokenData.id]

        pool.execute(sql, values, (err, results, fields)=>{
            if (err){
                res.status(500).send({error : "Erreur dans la requête "+err.message})
            }
            res.status(200).send({message : "Demande d'adhésion envoyée"})
        })
    }

    static deletePendingEquipe(req,res){
        const sql = "UPDATE Joueurs SET Pending_Equipe = NULL WHERE User_id = ?"
        const values = [req.tokenData.id]

        pool.execute(sql, values, (err, results, fields)=>{
            if (err){
                res.status(500).send({error : "Erreur dans la requête "+err.message})
            }
            res.status(200).send({message : "Demande d'adhésion annulée"})
        })
    }
};


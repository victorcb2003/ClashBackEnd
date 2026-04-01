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
                res.status(500).send({ error: "Erreur dans la requête " + err.message })
            }
            res.status(200).send({ Selectionneurs: results })
        })
    }

    static async acceptJoueur(req, res) {
        let sql = "select selectionneurs_id from Equipes where id = ?"
        let values = [req.body.Equipe_id]

        await pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur dans la requête " + err.message })
            }
            if (results.length == 0) {
                return res.status(404).send({ error: "Aucune équipe trouvée avec cet id." })
            }
            if (results[0].selectionneurs_id != req.tokenData.id) {
                return res.status(403).send({ error: "Accès non autorisé." })
            }
        })

        sql = "UPDATE Joueurs SET Equipe_id = ?, Pending_Equipe = NULL WHERE User_id = ?"
        values = [req.body.Equipe_id, req.body.User_id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur dans la requête " + err.message })
            }
            res.status(200).send({ message: "Joueur accepté dans l'équipe" })
        })
    }
};

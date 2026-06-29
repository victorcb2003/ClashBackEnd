const pool = require('../db/connection');

module.exports = class Paiement {

    // Ici je crée le paiement fictif en base et je renvoie une confirmation
    static create(req, res) {
        const sql = "insert into Paiement (User_id, Tournois_id, ModePaiement_id, montant, statut) values (?, ?, ?, ?, 'accepte')"
        const values = [req.tokenData.id, req.body.Tournois_id, req.body.ModePaiement_id, req.body.montant]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors du paiement. " + err.message })
            }
            return res.status(201).send({ message: "Paiement accepté", id: results.insertId })
        })
    }

    // Ici je renvoie la liste des modes de paiement disponibles (Carte, Espèces)
    static modes(req, res) {
        pool.query("select id, libelle from ModePaiement", (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des modes de paiement. " + err.message })
            }
            return res.status(200).send({ modes: results })
        })
    }
}
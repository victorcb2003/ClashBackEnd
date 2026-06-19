const pool = require('../db/connection');

module.exports = class Selec {

    // ─── POST /api/selec/addJoueur ────────────────────────────────────────────
    static addJoueur(req, res) {
        // Vérifier que le joueur appartient bien à l'équipe indiquée
        const sqlCheck = `
            SELECT j.id FROM Joueurs j
            WHERE j.id = ? AND j.Equipe_id = ?
        `
        pool.execute(sqlCheck, [req.body.Joueur_id, req.body.Equipe_id], (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la vérification du joueur. " + err.message })
            }
            if (results.length === 0) {
                return res.status(400).send({ error: "Ce joueur n'appartient pas à cette équipe." })
            }

            // Vérifier que l'équipe participe bien à ce match/tournois
            const sqlMatch = `
                SELECT id FROM Matchs
                WHERE id = ? AND Tournois_id = ?
                AND (Equipe1_id = ? OR Equipe2_id = ?)
            `
            pool.execute(sqlMatch, [req.body.Match_id, req.body.Tournois_id, req.body.Equipe_id, req.body.Equipe_id], (err, matchResults) => {
                if (err) {
                    return res.status(500).send({ error: "Erreur lors de la vérification du match. " + err.message })
                }
                if (matchResults.length === 0) {
                    return res.status(400).send({ error: "Ce match ne correspond pas à ce tournois ou cette équipe n'y participe pas." })
                }

                const sql = `
                    INSERT INTO JoueursMatch (Joueur_id, Match_id, Equipe_id, Tournois_id)
                    VALUES (?, ?, ?, ?)
                `
                const values = [req.body.Joueur_id, req.body.Match_id, req.body.Equipe_id, req.body.Tournois_id]

                pool.execute(sql, values, (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).send({ error: "Ce joueur est déjà sélectionné pour ce match." })
                        }
                        return res.status(500).send({ error: "Erreur lors de l'ajout du joueur. " + err.message })
                    }
                    return res.status(201).send({ message: "Le joueur a bien été ajouté à la sélection." })
                })
            })
        })
    }

    // ─── DELETE /api/selec/removeJoueur ──────────────────────────────────────
    static removeJoueur(req, res) {
        const sql = `DELETE FROM JoueursMatch WHERE Joueur_id = ? AND Match_id = ?`
        const values = [req.body.Joueur_id, req.body.Match_id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la suppression du joueur. " + err.message })
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ error: "Aucune sélection trouvée pour ce joueur et ce match." })
            }
            return res.status(200).send({ message: "Le joueur a bien été retiré de la sélection." })
        })
    }

    // ─── GET /api/selec/:match_id ─────────────────────────────────────────────
    // Filtrages optionnels via query params : ?tournois_id=X&equipe_id=Y
    static findByMatch(req, res) {
        let sql = `
            SELECT
                jm.id,
                jm.Joueur_id,
                jm.Match_id,
                jm.Equipe_id,
                jm.Tournois_id,
                u.prenom,
                u.nom,
                u.img_url,
                e.nom AS equipe_nom
            FROM JoueursMatch jm
            INNER JOIN Joueurs j ON j.id = jm.Joueur_id
            INNER JOIN User u ON u.id = j.User_id
            INNER JOIN Equipes e ON e.id = jm.Equipe_id
            WHERE jm.Match_id = ? and jm.Equipe_id = ?
        `

        console.log("req.params.match_id:", req.params.match_id, "req.params.equipe_id:", req.params.equipe_id);
        const values = [req.params.match_id, req.params.equipe_id]


        pool.query(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la récupération de la sélection. " + err.message })
            }
            return res.status(200).send({ selection: results })
        })
    }
}
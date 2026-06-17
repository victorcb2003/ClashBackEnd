const pool = require('../db/connection');

module.exports = class But {

    static create(req, res) {
        const sql = "insert into Buts (date_heure, User_id, Match_id, Type_But) values (?, ?, ?, ?)"
        const values = [req.body.date_heure, req.body.User_id, req.body.Match_id, req.body.Type_But]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la création du but. " + err.message })
            }

            But.updateScore(req.body.Match_id)

            return res.status(201).send({ message: "Le but a bien été enregistré." })
        })
    }

    static info(req, res) {
        let sql = "Select date_heure,User_id,Match_id,Type_But from But where id = ?"
        let values = [req.params.id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des informations du but." + err.message })
            }
            if (results.length == 0) {
                return res.status(404).send({ error: `Le but avec l'id ${req.params.id} n'a pas été trouvé` })
            }
            return res.status(200).send({ But: results[0] })
        })
    }

    static findAll(req, res) {
        let sql = `Select id, date_heure, User_id, Match_id, Type_but from Buts where Match_id = ?`

        pool.query(sql, req.params.id, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des buts." + err.message })
            }
            if (results.length == 0) {
                return res.status(200).send({ buts: [] })
            }
            return res.status(200).send({ buts: results })
        })
    }

    static delete(req, res) {
        // On récupère le Match_id avant de supprimer pour pouvoir mettre à jour le score
        let sql = "Select Match_id from Buts where id = ?"
        pool.execute(sql, [req.params.id], (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression du but " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il n'existe aucun but avec cet id." })
            }

            const matchId = results[0].Match_id

            sql = "delete from Buts where id = ?"
            pool.execute(sql, [req.params.id], (err, delResults) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression du but " + err.message })
                }
                if (delResults.affectedRows == 0) {
                    return res.status(400).send({ error: "Il n'existe aucun but avec cet id." })
                }

                But.updateScore(matchId)

                return res.status(200).send({ message: "Le but a bien été supprimé" })
            })
        })
    }

    static update(req, res) {
        let sql = "update Buts set date_heure = ?, User_id = ?, Match_id = ?, Type_But = ? where id = ?"
        let values = [req.body.date_heure, req.body.User_id, req.body.Match_id, req.body.Type_but, req.body.But_id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la modification du but." + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(400).send({ error: "Il y a aucun but avec cette id" })
            }

            But.updateScore(req.body.Match_id)

            return res.status(200).send({ message: "Le but a bien été modifié" })
        })
    }

    // ─── updateScore ──────────────────────────────────────────────────────────
    // Recalcule le score du match, le sauvegarde, puis si le match fait partie
    // d'un tournois et qu'il y a un vainqueur, place ce vainqueur dans le bon
    // slot du match du tour suivant.

    static updateScore(matchId) {
        // 1. Récupérer les infos du match + tous les buts avec l'équipe du buteur
        const sql = `
            SELECT Equipe1_id, Equipe2_id, Tournois_id, tour
            FROM Matchs WHERE id = ?;

            SELECT Joueurs.Equipe_id
            FROM Joueurs
            INNER JOIN Buts ON Buts.User_id = Joueurs.User_id
            WHERE Buts.Match_id = ?;
        `

        pool.query(sql, [matchId, matchId], (err, results) => {
            if (err) {
                return console.error("Erreur lors de la mise à jour du score : " + err.message)
            }

            const match = results[0][0]
            if (!match) return console.error("Match introuvable pour id " + matchId)

            // 2. Compter les buts par équipe
            let scoreEquipe1 = 0
            let scoreEquipe2 = 0

            results[1].forEach(but => {
                if (but.Equipe_id == match.Equipe1_id) scoreEquipe1++
                else scoreEquipe2++
            })

            const newScore = `${scoreEquipe1}-${scoreEquipe2}`

            // 3. Sauvegarder le score
            pool.execute("UPDATE Matchs SET score = ? WHERE id = ?", [newScore, matchId], (err) => {
                if (err) {
                    return console.error("Erreur lors de la sauvegarde du score : " + err.message)
                }

                // 4. Si pas dans un tournois → on s'arrête
                if (!match.Tournois_id) return

                // 5. Déterminer le vainqueur (pas de vainqueur si égalité)
                if (scoreEquipe1 === scoreEquipe2) return

                const winnerId = scoreEquipe1 > scoreEquipe2 ? match.Equipe1_id : match.Equipe2_id

                // 6. Trouver l'index de ce match dans le tour courant (ordre de création)
                // et en déduire quel slot du tour suivant il alimente
                const sqlIndex = `
                    SELECT id FROM Matchs
                    WHERE Tournois_id = ? AND tour = ?
                    ORDER BY id ASC
                `
                pool.execute(sqlIndex, [match.Tournois_id, match.tour], (err, matchsDuTour) => {
                    if (err) {
                        return console.error("Erreur lors de la récupération des matchs du tour : " + err.message)
                    }

                    // Index du match courant dans le tour (0-based)
                    const matchIndex = matchsDuTour.findIndex(m => m.id == matchId)
                    if (matchIndex === -1) return

                    // Index du match parent au tour suivant
                    const parentIndex = Math.floor(matchIndex / 2)
                    // Pair → Equipe1_id, Impair → Equipe2_id
                    const slotColonne = matchIndex % 2 === 0 ? "Equipe1_id" : "Equipe2_id"

                    // 7. Récupérer les matchs du tour suivant
                    const sqlNext = `
                        SELECT id FROM Matchs
                        WHERE Tournois_id = ? AND tour = ?
                        ORDER BY id ASC
                    `
                    pool.execute(sqlNext, [match.Tournois_id, match.tour + 1], (err, matchsSuivant) => {
                        if (err) {
                            return console.error("Erreur lors de la récupération des matchs du tour suivant : " + err.message)
                        }

                        // Pas de tour suivant = on est en finale, rien à faire
                        if (!matchsSuivant.length || !matchsSuivant[parentIndex]) return

                        const nextMatchId = matchsSuivant[parentIndex].id

                        // 8. Placer le vainqueur dans le bon slot
                        const sqlUpdate = `UPDATE Matchs SET ${slotColonne} = ? WHERE id = ?`
                        pool.execute(sqlUpdate, [winnerId, nextMatchId], (err) => {
                            if (err) {
                                return console.error("Erreur lors du passage au tour suivant : " + err.message)
                            }
                            console.log(`Vainqueur (equipe ${winnerId}) placé dans match ${nextMatchId} (${slotColonne})`)
                        })
                    })
                })
            })
        })
    }
}
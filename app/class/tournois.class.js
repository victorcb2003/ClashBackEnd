const pool = require('../db/connection');
const Match = require("./match.class")

module.exports = class Tournois {

    static create(req, res) {
        

        const sql = "insert into Tournois (nom,date_debut,lieu,Organisateurs_id) values (?,?,?,?)"
        const values = [req.body.nom, req.body.date, req.body.lieu, req.tokenData.id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    error: "Une erreur s'est produite lors de la création du tournois. " + err.message
                });
            }
            return res.status(200).send({ message: "Tournois créé avec succès" })
        })
    }

    static info(req, res) {
        

        let sql = `
        Select nom,lieu,date_debut,lancer,Organisateurs_id from Tournois where id = ?;
        Select Equipes.id,Equipes.nom from Equipes
        Inner Join Participants On Participants.Equipe_id = Equipes.id
        where Participants.Tournois_id = ?;
        select id,date_heure,lieu,Equipe1_id,Equipe2_id from Matchs where Tournois_id = ?;
        `
        let values = [req.params.id,req.params.id,req.params.id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération du tournois " + err.message })
            }
            res.status(200).send({Tournois : results[0],Equipes_Participantes : results[1],Matchs: results[2]})
        })
    }

    static findAll(req, res) {
        ;

        let sql = "Select id,nom,date_debut,lieu,Organisateurs_id from Tournois"

        pool.execute(sql, [], (err, Tournois, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des tournois " + err.message })
            }
            if (Tournois.length == 0) {
                return res.status(200).send({ Tournois: [] })
            }
            sql = ""
            let values = []
            Tournois.forEach((user) => {
                sql += "Select id,prenom,nom from User where id = ?;"
                values.push(user.Organisateurs_id)
            })
            pool.query(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des tournois" + err.message })
                }
                if (results.length == 0) {
                    return res.status(400).send({ error: "Une erreur s'est produite lors de la récupération des tournois" })
                }
                const tournois = []
                for (let i = 0; i < results.length; i++) {
                    tournois.push({
                        id: Tournois[i].id,
                        nom: Tournois[i].nom,
                        date: Tournois[i].date_debut,
                        lieu: Tournois[i].lieu,
                        Organisateurs: results[i]
                    })
                }
                return res.status(200).send({ Tournois: tournois })
            })
        })
    }
    static delete(req, res) {
        

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.params.id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression du tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas supprimer cette équipe" })
            }

            sql = "Delete from Tournois where id = ?"
            values = [req.params.id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été supprimé" })
            })
        })
    }

    static update(req, res) {
        

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors des changement du tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }

            let input = ""

            values = []

            if (req.body.nom) { input += "nom = ?, "; values.push(req.body.nom) }
            if (req.body.date) { input += "date_debut = ?, "; values.push(req.body.date) }
            if (req.body.lieu) { input += "lieu= ?, "; values.push(req.body.lieu) }

            values.push(req.body.Tournois_id)

            input = input.slice(0, -2)

            sql = `Update Tournois SET ${input} where id = ?`

            pool.execute(sql, values, (err) => {
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors du changement de nom de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "Le nom de l'équipe a bien été changé" })
            })
        })
    }
    static addEquipe(req, res) {
        

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de l'ajout de l'équipe au tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }

            sql = "Insert into Participants (Equipe_id,Tournois_id) values (?,?)"
            values = [req.body.Equipe_id, req.body.Tournois_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de l'ajout de l'équipe au tournois " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été ajouté au tournois" })
            })
        })
    }
    static removeEquipe(req, res) {
        

        let sql = "Select Organisateurs_id from Tournois where id = ?;Select id from Participants where Tournois_id = ? and Equipe_id = ?"
        let values = [req.body.Tournois_id, req.body.Tournois_id, req.body.Equipe_id]

        pool.query(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression de l'équipe du tournois " + err.message })
            }
            if (results[0].length == 0) {
                return res.status(400).send({ error: "Il y a aucun tournois avec cette id" })
            }
            if (results[0][0].Organisateurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }
            if (results[1].length == 0) {
                return res.status(400).send({ error: "Il y a aucun équipe avec cette id dans le tournois" })
            }

            sql = "Delete from Participants where id = ?"
            values = [results[1][0].id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression de l'équipe du tournois " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été supprimé au tournois" })
            })
        })
    }
    static abortStart(req) {
        

        sql = "UPDATE Tournois SET lancer = 1 WHERE id = ?;Delete from Matchs where Tournois_id = ?"
        values = [req.body.Tournois_id, req.body.Tournois_id]

        pool.query(sql, values)

    }
    static start(req, res) {
        

        let sql = "Select Organisateurs_id,date_debut,lieu,lancer from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors du démarrage tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }
            if (results[0].lancer == 1) {
                return res.status(400).send({ error: "Ce tournois a déja été lancé" })
            }

            sql = "Select Equipe_id from Participants where Tournois_id = ?"
            values = [req.body.Tournois_id]

            pool.execute(sql, values, (err, equipe, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                }
                if (results.length == 0) {
                    return res.status(400).send({ error: "Il y a aucun équipe inscrite a ce tournois" })
                }

                const equipes = []

                equipe.forEach((element) => {
                    equipes.push(element.Equipe_id)
                })

                if (equipes.length <= 1) {
                    return res.status(400).send({ error: "Il y a pas asser d'équipe inscrite a ce tournois" })
                }

                if (![2,4,8,16,32,64,128].includes(equipes.length)) {
                    return res.status(400).send({ error: `Il y a ${equipes.length} équipes dans le tournois, il faut que se soit un carré de 2` })
                }

                const date_debut = new Date(results[0].date_debut)
                date_debut.setHours(date_debut.getHours()+10)

                const tours = Math.ceil(Math.sqrt(equipes.length))

                sql = ""
                values = []
                let h = 0
                let d = 0

                for (let y = 0; y < tours; y++) {
                    for (let i = 0; i < 2 ** (tours - y - 1); i++) {

                        sql += "insert into Matchs (date_heure,lieu,tour,Tournois_id) values (?,?,?,?);"

                        const date = new Date(date_debut)

                        date.setHours(date.getHours() + h)
                        date.setDate(date.getDate() + d)

                        h += 3

                        if (h == 9) {
                            h = 0
                            d += 1
                        }

                        values.push(date)
                        values.push(results[0].lieu)
                        values.push(y + 1)
                        values.push(req.body.Tournois_id)
                    }
                }
                sql += "UPDATE Tournois SET lancer = 1 WHERE id = ?;"
                values.push(req.body.Tournois_id)
                pool.query(sql, values, (err) => {
                    if (err) {
                        Tournois.abortStart()
                        return res.status(500).send({ error: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                    }

                    const arbre = []
                    let index = 0

                    while (equipes.length != 0) {
                        const rdm = Math.floor(Math.random() * equipes.length)
                        arbre[index] = equipes[rdm]
                        equipes.splice(rdm, 1)
                        index += 1
                    }

                    sql = "Select id from Matchs where Tournois_id = ? and tour = 1"
                    values = [req.body.Tournois_id]

                    pool.execute(sql, values, (err, results, fields) => {
                        if (err) {
                            Tournois.abortStart()
                            return res.status(500).send({ error: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                        }

                        sql = ""
                        values = []

                        for (let i = 0; i < arbre.length / 2; i++) {
                            sql += "UPDATE Matchs SET Equipe1_id = ?,Equipe2_id = ? WHERE id = ?;"
                            values.push(arbre[2 * i])
                            values.push(arbre[2 * i + 1])
                            values.push(results[i].id)
                        }
                        pool.query(sql, values, (err, results, fields) => {
                            if (err) {
                                Tournois.abortStart()
                                return res.status(500).send({ error: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                            }
                            return res.status(200).send({ message: "Le tournois a bien été lancé" })
                        })
                    })
                })
            })
        })
    }
}

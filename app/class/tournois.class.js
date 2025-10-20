const dbconnection = require('../db/connection');
const Match = require("./match.class")

module.exports = class Tournois {

    static create(req, res) {
        const connection = dbconnection()

        const sql = "insert into Tournois (nom,date_debut,lieu,Organisateurs_id) values ( ?, ?,?,?)"
        const values = [req.body.nom, req.body.date, req.body.lieu, req.tokenData.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({
                    message: "Une erreur s'est produite lors de la création du tournois. " + err.message
                });
            }
            return res.status(200).send({ message: "Tournois créé avec succès" })
        })
    }

    static info(req, res) {
        const connection = dbconnection()

        let sql = "Select Equipe_id from Participants where Tournois_id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des equipes " + err.message })
            }
            if (results[0].length == 0) {
                return res.status(200).send({ message: "Il y a aucune équipe dans ce tournois" })
            }
            sql = ""
            values = []

            results.forEach((equipe) => {
                sql += "Select id,nom from Equipes Where id = ?;"
                values.push(equipe.Equipe_id)
            })
            connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
                }
                if (results.length == 0) {
                    return res.status(400).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe" })
                }
                return res.status(200).send({ results })
            })
        })
    }

    static findAll(req, res) {
        const connection = dbconnection();

        let sql = "Select id,nom,date_debut,lieu,Organisateurs_id from Tournois"

        connection.execute(sql, [], (err, Tournois, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des tournois " + err.message })
            }
            if (Tournois.length == 0) {
                return res.status(403).send({ Tournois: [] })
            }
            sql = ""
            let values = []
            Tournois.forEach((user) => {
                sql += "Select prenom,nom from User where id = ?;"
                values.push(user.Organisateurs_id)
            })
            connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des tournois" + err.message })
                }
                if (results.length == 0) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des tournois" })
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
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression du tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas supprimer cette équipe" })
            }

            sql = "Delete from Tournois where id = ?"
            values = [req.params.id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été supprimé" })
            })
        })
    }

    static update(req, res) {
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors des changement du tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }

            let input = ""

            values = []

            if (req.body.nom) { input += "nom = ?, "; values.push(req.body.nom) }
            if (req.body.date) { input += "date_debut = ?, "; values.push(req.body.date) }
            if (req.body.lieu) { input += "lieu= ?, "; values.push(req.body.lieu) }

            values.push(req.body.Tournois_id)

            input = input.slice(0, -2)

            sql = `Update Tournois SET ${input} where id = ?`

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors du changement de nom de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "Le nom de l'équipe a bien été changé" })
            })
        })
    }
    static addEquipe(req, res) {
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de l'ajout de l'équipe au tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }

            sql = "Insert into Participants (Equipe_id,Tournois_id) values (?,?)"
            values = [req.body.Equipe_id, req.body.Tournois_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de l'ajout de l'équipe au tournois " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été ajouté au tournois" })
            })
        })
    }
    static removeEquipe(req, res) {
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?;Select id from Participants where Tournois_id = ? and Equipe_id = ?"
        let values = [req.body.Tournois_id, req.body.Tournois_id, req.body.Equipe_id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression de l'équipe du tournois " + err.message })
            }
            if (results[0].length == 0) {
                return res.status(403).send({ message: "Il y a aucun tournois avec cette id" })
            }
            if (results[0][0].Organisateurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }
            if (results[1].length == 0) {
                return res.status(403).send({ message: "Il y a aucun équipe avec cette id dans le tournois" })
            }

            sql = "Delete from Participants where id = ?"
            values = [results[1][0].id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression de l'équipe du tournois " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été supprimé au tournois" })
            })
        })
    }
    static abortStart(req) {
        const connection = dbconnection()

        sql = "UPDATE Tournois SET lancer = 1 WHERE id = ?;Delete from Matchs where Tournois_id = ?"
        values = [req.body.Tournois_id, req.body.Tournois_id]

        connection.query(sql, values)

    }
    static start(req, res) {
        const connection = dbconnection()

        let sql = "Select Organisateurs_id,date_debut,lieu,lancer from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors du démarrage tournois " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun tournois avec cette id" })
            }
            if (results[0].Organisateurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas faire de changement dans ce tournois" })
            }
            if (results[0].lancer == 1) {
                return res.status(403).send({ message: "Ce tournois a déja été lancé" })
            }

            sql = "Select Equipe_id from Participants where Tournois_id = ?"
            values = [req.body.Tournois_id]

            connection.execute(sql, values, (err, equipe, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                }
                if (results.length == 0) {
                    return res.status(403).send({ message: "Il y a aucun équipe inscrite a ce tournois" })
                }

                const equipes = []

                equipe.forEach((element) => {
                    equipes.push(element.Equipe_id)
                })

                if (equipes.length <= 1) {
                    return res.status(403).send({ message: "Il y a pas asser d'équipe inscrite a ce tournois" })
                }

                if (Math.sqrt(equipes.length) != Math.round(Math.sqrt(equipes.length))) {
                    return res.status(403).send({ message: `Il y a ${equipes.length} équipes dans le tournois, il faut que se soit un carré de 2` })
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
                connection.query(sql, values, (err, results1, fields) => {
                    if (err) {
                        Tournois.abortStart()
                        return res.status(403).send({ message: "Une erreur s'est produite lors du démarrage tournois " + err.message })
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

                    connection.execute(sql, values, (err, results, fields) => {
                        if (err) {
                            Tournois.abortStart()
                            return res.status(403).send({ message: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                        }

                        sql = ""
                        values = []

                        for (let i = 0; i < arbre.length / 2; i++) {
                            sql += "UPDATE Matchs SET Equipe1_id = ?,Equipe2_id = ? WHERE id = ?;"
                            values.push(arbre[2 * i])
                            values.push(arbre[2 * i + 1])
                            values.push(results[i].id)
                        }
                        connection.query(sql, values, (err, results, fields) => {
                            if (err) {
                                Tournois.abortStart()
                                return res.status(403).send({ message: "Une erreur s'est produite lors du démarrage tournois " + err.message })
                            }
                            return res.status(200).send({ message: "Le tournois a bien été lancé" })
                        })
                    })
                })
            })
        })
    }
}

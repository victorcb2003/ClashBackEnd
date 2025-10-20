const dbconnection = require('../db/connection');

module.exports = class Groupe {

    static create(req, res) {
        const connection = dbconnection()

        let sql = "insert into Groupes (nom,Owner_id) values (?,?)"
        let values = [req.body.nom, req.tokenData.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({
                    message: "Une erreur s'est produite lors de la création du groupe. " + err.message
                });
            }

            sql = "Select id from Groupes where nom = ?"
            values = [req.body.nom]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {

                    sql = "Delete from Groupes where nom = ?"
                    values = [req.body.nom]
                    connection.execute(sql, values)

                    return res.status(401).send({ message: "Une erreur s'est produite lors de la création du groupe. " + err.message })
                }

                sql = "insert into Groupes_Membres (Groupe_id,User_id) values (?,?)"
                values = [results[0].id, req.tokenData.id]

                connection.execute(sql, values, (err, results, fields) => {
                    if (err) {
                        return res.status(401).send({ message: "Une erreur s'est produite lors de la création du groupe. " + err.message })
                    }
                    return res.status(200).send({ message: "Le groupe a bien été créé" })
                })
            })
        })
    }

    static add(req, res) {
        const connection = dbconnection()

        let sql = "Select id from Groupes_Membres where User_id = ? and Groupe_id = ?"
        let values = [req.tokenData.id, req.body.groupe_id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de l'ajout du membre au groupe." + err.message })
            }

            if (results.length == 0) {
                return res.status(403).send({ message: "Le user n'est pas dans ce groupe" })
            }

            sql = "insert into Groupes_Membres (Groupe_id,User_id) values (?,?)"
            values = [req.body.groupe_id, req.body.user_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de l'ajout du user au groupe. " + err.message })
                }
                return res.status(200).send({ message: "Le user a bien été ajouté dans le groupe." })
            })
        })
    }
    static info(req, res) {
        const connection = dbconnection()

        let sql = "Select nom from Groupes where id = ?;Select User_id from Groupes_Membres where Groupe_id = ?"
        let values = [req.params.id, req.params.id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
            }
            if (results.length == 0) {
                return res.status(200).send({ message: "Il y a aucun Joueur dans cette Équipe" })
            }

            sql = ""
            values = []

            results[1].forEach((user) => {
                sql += "Select id,prenom,nom from User Where id = ?;"
                values.push(user.User_id)
            })

            connection.query(sql, values, (err, result, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info du groupe " + err.message })
                }
                if (result.length == 0) {
                    return res.status(400).send({ message: "Une erreur s'est produite lors de la récupération des info du groupe" })
                }
                return res.status(200).send({
                    Groupe: results[0][0].nom,
                    result
                })
            })
        })
    }

    static findAll(req, res) {
        const connection = dbconnection();

        let sql = "Select id,nom from Groupes"

        connection.execute(sql, (err, groupes, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
            }
            if (groupes.length == 0) {
                return res.status(400).send({ message: "Il y a aucun groupe" })
            }

            sql = ""
            let values = []

            groupes.forEach((groupe) => {
                sql += "Select id from Groupes_Membres where Groupe_id = ?;"
                values.push(groupe.id)
            })

            connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
                }
                if (results.length == 0) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des noms des équipes " })
                }
                const groupe = []
                for (let i = 0; i < results.length; i++) {
                    groupe.push({
                        id: groupes[i].id,
                        nom: groupes[i].nom,
                        taille: results[i].length
                    })
                }
                return res.status(200).send({ Groupe: groupe })
            })
        })
    }
    static delete(req, res) {
        const connection = dbconnection()

        let sql = "Select Owner_id from Groupes where id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression du groupe " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun groupe avec cette id" })
            }
            if (results[0].Owner_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas supprimer ce groupe" })
            }

            sql = "Delete from Groupes where id = ?"
            values = [req.body.groupe_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression du groupe " + err.message })
                }
                return res.status(200).send({ message: "Le groupe a bien été supprimé" })
            })
        })
    }
    static remove(req, res) {
        const connection = dbconnection()

        let sql = "Select Owner_id from Groupes where id = ?; Select id from Groupes_Membres where User_id = ? and Groupe_id = ?"
        let values = [req.body.groupe_id, req.body.user_id, req.body.groupe_id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de la suppression du user du groupe " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de la suppression du user du groupe" })
            }
            if (results[0][0].Owner_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous n'etes pas le propriétaire de ce groupe." })
            }
            if (results[1].length == 0) {
                return res.status(403).send({ message: "Le joueur_id est invalide" })
            }

            sql = "Delete from Groupes_Membres where Groupe_id = ? and User_id = ?;"
            values = [req.body.groupe_id, req.body.user_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de la suppression du user du groupe. " + err.message })
                }
                return res.status(200).send({ message: "Le joueur a bien été retiré du groupe" })
            })
        })
    }
    static rename(req, res) {
        const connection = dbconnection()

        let sql = "Select Owner_id from Groupes where id = ?"
        let values = [req.body.groupe_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors du changement de nom du groupe " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun groupe avec cette id" })
            }
            if (results[0].Owner_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous ne pouvez pas changer le nom de ce groupe" })
            }

            sql = "Update Groupes Set nom = ? where id = ?"
            values = [req.body.nom, req.body.groupe_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors du changement de nom du groupe " + err.message })
                }
                return res.status(200).send({ message: "Le nom du groupe a bien été changé" })
            })
        })
    }

    static messageCreate(req, res) {
        const connection = dbconnection()

        const sql = "Insert into Groupes_Messages (expediteur_id,Groupe_id,message) values (?,?,?)"
        const values = [req.tokenData.id, req.body.groupe_id, req.body.message]
        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la création du message. " + err.message })
            }
            return res.status(201).send({ message: "Le message a bien était créé" })
        })

    }

    static messageDelete(req, res) {
        const connection = dbconnection()

        let sql = "select expediteur_id from Groupes_Messages where id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression du message. " + err.message })
            }
            if (results.length == 0){
                return res.status(400).send({ message : "aucun message avec cette id"})
            }
            if (results[0].expediteur_id != req.tokenData.id) {
                return res.status(403).send({ message: "L'id de l'expediteur est différent de l'utilisateur connecté" })
            }

            sql = "delete from Groupes_Messages where id = ?"

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression du message. " + err.message })
                }
                return res.status(201).send({ message: "Le message a bien était supprimé" })
            })
        })

    }

    static messageFindAll(req, res) {
        const connection = dbconnection()

        const sql = "SELECT Groupes_Messages.* FROM Groupes_Messages JOIN Groupes_Membres ON Groupes_Messages.Groupe_id = Groupes_Membres.Groupe_id WHERE Groupes_Membres.User_id = ?"
        const values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des messages. " + err.message })
            }
            res.status(200).send({ messages: results })
        })
    }

    static messageUpdate(req, res) {
        const connection = dbconnection()

        let sql = "Select expediteur_id from Groupes_Messages where id = ?"
        let values = [req.body.message_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la modification du message. " + err.message })
            }
            if (results.length == 0) {
                res.status(400).send({ message: "L'id du message n'existe pas" })
            }
            if (results[0].expediteur_id != req.tokenData.id) {
                return res.status(401).send({ message: "L'id de l'expediteur est différent de l'utilisateur connecté" })
            }

            sql = "update Groupes_Messages Set message = ? where id = ?"
            values = [req.body.message, req.body.message_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors de la modification du message. " + err.message })
                }
                return res.status(200).send({ message: "Le message a bien été modifié" })
            })
        })
    }
}

const dbconnection = require('../db/connection');

module.exports = class Message {

    static create(req, res) {
        const connection = dbconnection()

        const sql = "Insert into Messages (expediteur_id,destinataire_id,message) values (?,?,?)"
        const values = [req.tokenData.id, req.body.destinataire_id, req.body.message]
        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la création du message. " + err.message })
            }
            return res.status(201).send({ message: "Le message a bien était créé" })
        })

    }

    static delete(req, res) {
        const connection = dbconnection()

        let sql = "select expediteur_id from Messages where id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression du message. " + err.message })
            }
            if (results[0].expediteur_id != req.tokenData.id) {
                res.status(403).send({ message: "L'id de l'expediteur est différent de l'utilisateur connecté" })
            }

            sql = "delete from Messages where id = ?"

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression du message. " + err.message })
                }
                return res.status(201).send({ message: "Le message a bien était supprimé" })
            })
        })

    }

    static findAll(req, res) {
        const connection = dbconnection()

        const sql = "Select * from Messages where expediteur_id = ? or destinataire_id = ?"
        const values = [req.params.id, req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des messages. " + err.message })
            }
            res.status(200).send({ messages: results })
        })
    }

    static update(req, res) {
        const connection = dbconnection()

        let sql = "Select expediteur_id from Messages where id = ?"
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

            sql = "update Messages Set message = ? where id = ?"
            values = [req.body.message, req.body.message_id]

            connection.execute(sql,values,(err,results,fields)=>{
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors de la modification du message. " + err.message })
                }
                return res.status(200).send({message : "Le message a bien été modifié"})
            })
        })
    }
}
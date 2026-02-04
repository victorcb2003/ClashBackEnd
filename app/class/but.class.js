const dbconnection = require('../db/connection');

module.exports = class But {

    static create(req, res) {
        const connection = dbconnection()

        const sql = "insert into Buts (date_heure, User_id, Match_id, Type_But) values ( ?, ?, ?,?)"

        const values = [req.body.date_heure, req.body.User_id, req.body.Match_id, req.body.Type_But]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    message: "Une erreur s'est produite lors de la création du but. " + err.message
                });
            }
            return res.status(201).send({ message: "Le but a bien été enregistré." })
        })
    }

    static info(req, res) {
        const connection = dbconnection()

        let sql = "Select date_heure,User_id,Match_id,Type_But from But where id = ?"
        let values = [req.params.id, req.params.id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des informations du but." + err.message })
            }
            if (results.length == 0) {
                return res.status(404).send({ message: `Le but avec l'id ${req.params.id} n'a pas été trouvé` })
            }

            return res.status(200).send({
                But: results[0]
            })
        })
    }

    static findAll(req, res) {
        const connection = dbconnection();

        let sql = `
        Select id, date_heure, User_id, Match_id, Type_but from Buts where Match_id = ?
        `

        connection.query(sql, req.params.id, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des buts." + err.message })
            }
            if (results.length == 0) {
                return res.status(200).send({ buts: [] })
            }

            return res.status(200).send({ buts: results })
        })
    }
    static delete(req, res) {
        const connection = dbconnection()

        let sql = "delete from Buts where id = ?"
        let values = [req.params.id]

        connection.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression du but" + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(403).send({ message: "Il n'existe aucun but avec cet id." })
            }
            return res.status(200).send({ message: "Le but a bien été supprimé" })
        })
    }

    static update(req, res) {
        const connection = dbconnection()

        let sql = "update from But "
        let values = []

        const allowedFields = ["date_heure", "User_id", "Match_id", "Type_But"];

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                sql += (`${key} = ?`);
                values.push(req.body[key]);
            }
        }

        connection.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Une erreur s'est produite lors de la modification du but." + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(403).send({ message: "Il y a aucun but avec cette id" })
            }
            return res.status(200).send({message : "Le but a bien été modifié"})
        })
    }
}

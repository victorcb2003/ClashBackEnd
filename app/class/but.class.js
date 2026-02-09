const pool = require('../db/connection');

module.exports = class But {

    static create(req, res) {
        

        const sql = "insert into Buts (date_heure, User_id, Match_id, Type_But) values ( ?, ?, ?,?)"

        const values = [req.body.date_heure, req.body.User_id, req.body.Match_id, req.body.Type_But]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la création du but. " + err.message});
            }
            return res.status(201).send({ message: "Le but a bien été enregistré." })
        })
    }

    static info(req, res) {
        

        let sql = "Select date_heure,User_id,Match_id,Type_But from But where id = ?"
        let values = [req.params.id, req.params.id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des informations du but." + err.message })
            }
            if (results.length == 0) {
                return res.status(404).send({ error: `Le but avec l'id ${req.params.id} n'a pas été trouvé` })
            }

            return res.status(200).send({
                But: results[0]
            })
        })
    }

    static findAll(req, res) {
        ;

        let sql = `
        Select id, date_heure, User_id, Match_id, Type_but from Buts where Match_id = ?
        `

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
        

        let sql = "delete from Buts where id = ?"
        let values = [req.params.id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression du but" + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(403).send({ error: "Il n'existe aucun but avec cet id." })
            }
            return res.status(200).send({ message: "Le but a bien été supprimé" })
        })
    }

    static update(req, res) {
        

        let sql = "update from But "
        let values = []

        const allowedFields = ["date_heure", "User_id", "Match_id", "Type_But"];

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                sql += (`${key} = ?`);
                values.push(req.body[key]);
            }
        }

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la modification du but." + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(403).send({ error: "Il y a aucun but avec cette id" })
            }
            return res.status(200).send({message : "Le but a bien été modifié"})
        })
    }
}

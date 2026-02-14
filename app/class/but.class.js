const pool = require('../db/connection');

module.exports = class But {

    static create(req, res) {
        

        const sql = "insert into Buts (date_heure, User_id, Match_id, Type_But) values ( ?, ?, ?,?)"

        const values = [req.body.date_heure, req.body.User_id, req.body.Match_id, req.body.Type_But]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la création du but. " + err.message});
            }

            But.updateScore(req,res, req.body.Match_id)

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
                return res.status(400).send({ error: "Il n'existe aucun but avec cet id." })
            }

            But.updateScore(req,res, req.params.id)

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
                return res.status(400).send({ error: "Il y a aucun but avec cette id" })
            }

            But.updateScore(req,res, req.body.Match_id)

            return res.status(200).send({message : "Le but a bien été modifié"})
        })
    }
    static updateScore(req,res, matchId){
        let sql = `
        select Equipe1_id, Equipe2_id from Matchs where id = ?;
        select Joueurs.Equipe_id from Joueurs 
        inner join Buts on Buts.User_id = Joueurs.User_id
        where Match_id = ?;
        `
        let value = [matchId,matchId]
    
        pool.query(sql, value, (err, results) => {
            if (err) {
                return console.error( "Érreur lors de la mise à jour du score " + err.message )
            }
            let scoreEquipe1 = 0
            let scoreEquipe2 = 0

            const match = results[0]

            results[1].forEach(but => {
                if (but.Equipe_id == match[0].Equipe1_id) {
                    scoreEquipe1++
                } else {
                    scoreEquipe2++
                }
            });

            sql = "update Matchs set score = ? where id = ?"
            value = [`${scoreEquipe1}-${scoreEquipe2}`, matchId]

            pool.execute(sql, value, (err) => {
                if (err) {
                    return console.error( "Érreur lors de la mise à jour du score " + err.message )
                }
            })
        })
    }
}

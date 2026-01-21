const dbconnection = require('../db/connection');

module.exports = class match {
    static findAll(req, res) {
        const connection = dbconnection()

        const sql = "Select * from Matchs where Tournois_id = ?"

        connection.execute(sql, [req.params.id], (err, results) => {
            if (err) {
                return res.status(403).send({ message: "Érreur lors de la création d'un match " + err.message })
            }
            return res.status(200).send({ matchs: results })
        })
    }
    static update(req, res) {
        const connection = dbconnection()

        let sql = "Select Tournois_id from Matchs where id = ?"
        let values = [req.body.Match_id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Érreur lors de la modification d'un match " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Il y a aucun match avec cette id" })
            }
            sql = "Select Organisateurs_id from Tournois where id = ?"
            values = [results[0].Tournois_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Érreur lors de la modification d'un match " + err.message })
                }
                if (results[0].Organisateurs_id != req.tokenData.id) {
                    return res.status(401).send({ message: "route non autorisée" })
                }

                sql = ""
                values = []

                if (req.body.Equipe1_id != undefined) {
                    sql += "Select id from Equipes where id = ?"
                    values.push(req.body.Equipe1_id)
                }
                if (req.body.Equipe2_id != undefined) {
                    sql += "Select id from Equipes where id = ?"
                    values.push(req.body.Equipe2_id)
                }

                function next(){
                    sql = "Update Matchs Set "
                    values = []

                    if (req.body.Equipe1 != undefined){
                        sql += "Equipe1_id = ?, "
                        values.push(req.body.Equipe1)
                    }
                    if (req.body.Equipe2 != undefined){
                        sql += "Equipe2_id = ?, "
                        values.push(req.body.Equipe2)
                    }
                    if (req.body.score != undefined){
                        sql += "score = ?, "
                        values.push(req.body.score)
                    }
                    if (req.body.date_heure != undefined){
                        sql += "date_heure = ?, "
                        values.push(req.body.date_heure)
                    }
                    if (req.body.lieu != undefined){
                        sql += "lieu = ?, "
                        values.push(req.body.lieu)
                    }

                    sql = sql.slice(0, -2)
                    sql+= " where id = ?"
                    values.push(req.body.Match_id)
                    
                    connection.query(sql,values,(err,results,fields)=>{
                        if (err) {
                            return res.status(403).send({ message: "Érreur lors de la modification d'un match " + err.message })
                        }
                        return res.status(200).send({message : "Le match a bien été mise a jour."})
                    })
                }
                
                if (values.length != 0) {

                    connection.query(sql, values, (err, results, fields) => {
                        if (err) {
                            return res.status(403).send({ message: "Érreur lors de la modification d'un match " + err.message })
                        }
                        if (results.length == 0) {
                            return res.status(403).send({ message: "req.body.Equipe1_id et req.body.Equipe2_id non valide" })
                        }
                        if (values.length == 2 && results.length == 1) {
                            return res.status(403).send({ message: "req.body.Equipe1_id ou req.body.Equipe2_id non valide" })
                        }
                    })
                    next()
                }
                next()
            })
        })
    }
    static create(req,res){
        const sql = "insert into Matchs (date_heure,lieu,Equipe1_id,Equipe2_id) values (?,?,?,?)"
        const value = [req.body.date_heure,req.body.lieu,req.body.Equipe1_id,req.body.Equipe2_id]

        const connection = dbconnection()

        connection.query(sql,value,(err,results)=>{
            if (err){
                res.status(403).send({message:`Érreur lors de la création du match ${err.message}`})
            }
            res.status(201).send({message:"Le Match a bien été créé"})
        })
    }

    static getById(req,res){
        const sql = "select date_heure,lieu,Equipe1_id,Equipe2_id,tour,Tournois_id,score from Matchs where id = ?"
        const value = req.params.id

        const connection = dbconnection()

        connection.query(sql,value,(err,results)=>{
            if (err){
                res.status(403).send({message : `Érreur lors de la récupération d'un match ${err.message}`})
            }
            res.status(201).send({match : results[0]})
        })
    }
}
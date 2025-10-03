const dbconnection = require('../db/connection');

module.exports = class Tournois {

    static create(req, res) {
        const connection = dbconnection()

        const sql = "insert into Tournois (nom,date_debut,lieu,Organisateurs_id) values ( ?, ?,?,?)"
        const values = [req.body.nom,req.body.date,req.body.lieu,req.tokenData.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({
                    message: "Une erreur s'est produite lors de la création du tournois. " + err.message
                });
            }
            return res.status(200).send({ message: "Tournois créé avec succès" })
        })
    }

    // static info(req, res) {
    //     const connection = dbconnection()

    //     let sql = "Select id from Joueurs where Tournois_id = ?;Select nom from Tournois where id = ?"
    //     let values = [req.params.id,req.params.id]

    //     connection.execute(sql, values, (err, results, fields) => {
    //         if (err) {
    //             return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
    //         }
    //         if (results.length == 0) {
    //             return res.status(200).send({ message: "Il y a aucun Joueur dans cette Équipe" })
    //         }

    //         sql = ""
    //         values = []

    //         results.forEach((joueur) => {
    //             sql += "Select id,prenom,nom from User Where id = ?;"
    //             values.push(joueur.id)
    //         })
    //         connection.query(sql, values, (err, results, fields) => {
    //             if (err) {
    //                 return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
    //             }
    //             if (results.length == 0) {
    //                 return res.status(400).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe" })
    //             }
    //             return res.status(200).send({ results })
    //         })
    //     })
    // }

    static findAll(req, res) {
        const connection = dbconnection();

        let sql = "Select id,nom,date_debut,lieu,Organisateurs_id from Tournois"

        connection.execute(sql, (err, Tournois, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des tournois " + err.message })
            }
            if (Tournois.length == 0){
                return res.status(403).send({ message : "Il y a pas de tournois"})
            }
            sql = ""
            let values = []
            Tournois.forEach((user)=>{
                sql += "Select prenom,nom from User where id = ?;"
                values.push(user.Organisateurs_id)
            })
            connection.query(sql,values,(err,results,fields)=>{
                if (err) {
                    return res.status(403).send({message : "Une erreur s'est produite lors de la récupération des tournois" + err.message })
                }
                if (results.length == 0){
                    return res.status(403).send({message : "Une erreur s'est produite lors de la récupération des tournois" })
                }
                const tournois = []
                for (let i = 0; i< results.length; i++ ){
                    tournois.push({
                        id : Tournois[i].id,
                        nom : Tournois[i].nom,
                        Organisateurs : results[i]
                    })
                }
                return res.status(200).send({ Tournois : tournois})
            })
        })
    }
    static delete(req,res){
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(403).send({message : "Une erreur s'est produite lors de la suppression du tournois "+err.message})
            }
            if (results.length == 0){
                return res.status(403).send({ message : "Il y a aucun tournois avec cette id"})
            }
            if (results[0].Organisateurs_id != req.tokenData.id){
                return res.status(401).send({ message : "Vous ne pouvez pas supprimer cette équipe"})
            }
            
            sql = "Delete from Tournois where id = ?"
            values = [req.body.Tournois_id]

            connection.execute(sql,values,(err,results,fields)=>{
                if (err){
                    return res.status(403).send({message : "Une erreur s'est produite lors de la suppression de l'équipe "+err.message})
                }
                return res.status(200).send({ message : "L'équipe a bien été supprimé"})
            })
        })
   }

    static update (req,res){
        const connection = dbconnection()

        let sql = "Select Organisateurs_id from Tournois where id = ?"
        let values = [req.body.Tournois_id]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(403).send({message : "Une erreur s'est produite lors des changement du tournois "+err.message})
            }
            if (results.length == 0){
                return res.status(403).send({ message : "Il y a aucun tournois avec cette id"})
            }
            if (results[0].Organisateurs_id != req.tokenData.id){
                return res.status(401).send({ message : "Vous ne pouvez pas faire de changement dans ce tournois"})
            }
            
            let input = ""

            values = []

            if (req.body.nom){input+="nom = ?, ";values.push(req.body.nom)}
            if (req.body.date){input+="date_debut = ?, ";values.push(req.body.date)}
            if (req.body.lieu){input+="lieu= ?, ";values.push(req.body.lieu)}

            values.push(req.body.Tournois_id)

            input = input.slice(0,-2)

            sql = `Update Tournois SET ${input} where id = ?`

            connection.execute(sql,values,(err,results,fields)=>{
                if (err){
                    return res.status(403).send({message : "Une erreur s'est produite lors du changement de nom de l'équipe "+err.message})
                }
                return res.status(200).send({ message : "Le nom de l'équipe a bien été changé"})
            })
        })
    }
}

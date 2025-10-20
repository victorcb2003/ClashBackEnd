const dbconnection = require('../db/connection');

module.exports = class Equipe {

    static create(req, res) {
        const connection = dbconnection()

        const sql = "insert into Equipes (nom, Selectionneurs_id) values ( ?, ?)"
        const values = [req.body.nom, req.tokenData.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({
                    message: "Une erreur s'est produite lors de la création de l'équipe. " + err.message
                });
            }
            return res.status(200).send({ message: "Équipe créé avec succès" })
        })
    }

    static addJoueur(req, res) {
        const connection = dbconnection()

        let sql = "Select Selectionneurs_id from Equipes where id = ?; Select id from Joueurs where User_id = ?"
        let values = [req.body.Equipe_id, req.body.Joueur_id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " })
            }
            if (results[0][0].Selectionneurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous n'avez pas accès a cette équipe" })
            }
            if (results[1].length == 0) {
                return res.status(403).send({ message: "Le Joueur_id est invalide" })
            }
            sql = "UPDATE Joueurs SET Equipe_id = ? WHERE User_id = ?;"
            values = [req.body.Equipe_id, req.body.Joueur_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de l'ajout d'un joueur a l'équipe. " + err.message })
                }
                return res.status(200).send({ message: "Le joueur a bien été ajouté dans l'équipe" })
            })
        })
    }
    static info(req, res) {
        const connection = dbconnection()

        let sql = "Select id from Joueurs where Equipe_id = ?;Select nom from Equipes where id = ?"
        let values = [req.params.id,req.params.id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
            }
            if (results.length == 0) {
                return res.status(200).send({ message: "Il y a aucun Joueur dans cette Équipe" })
            }

            sql = ""
            values = []

            results[0].forEach((joueur) => {
                sql += "Select id,prenom,nom from User Where id = ?;"
                values.push(joueur.id)
            })
            connection.query(sql, values, (err, result, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
                }
                if (result.length == 0) {
                    return res.status(400).send({ message: "Une erreur s'est produite lors de la récupération des info de l'Équipe" })
                }
                return res.status(200).send({
                    Équipe : results[1][0].nom,
                    result
                 })
            })
        })
    }

    static findAll(req, res) {
        const connection = dbconnection();

        let sql = "Select id,nom,Selectionneurs_id from Equipes"

        connection.execute(sql, (err, equipes, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
            }
            if (equipes.length == 0){
                return res.status(200).send({ equipes : []})
            }
            sql = ""
            let values = []
            equipes.forEach((equipe)=>{
                sql += "Select prenom,nom from User where id = ?;"
                values.push(equipe.Selectionneurs_id)
            })
            connection.query(sql,values,(err,results,fields)=>{
                if (err) {
                    return res.status(403).send({message : "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
                }
                if (results.length == 0){
                    return res.status(403).send({message : "Une erreur s'est produite lors de la récupération des noms des équipes " })
                }
                const equipe = []
                for (let i = 0; i< results.length; i++ ){
                    equipe.push({
                        id : equipes[i].id,
                        nom : equipes[i].nom,
                        Selectionneurs : results[i]
                    })
                }
                return res.status(200).send({ equipes : equipe})
            })
        })
    }
    static delete(req,res){
        const connection = dbconnection()

        let sql = "Select Selectionneurs_id from Equipes where id = ?"
        let values = [req.body.Equipe_id]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(403).send({message : "Une erreur s'est produite lors de la suppression de l'équipe "+err.message})
            }
            if (results.length == 0){
                return res.status(403).send({ message : "Il y a aucune équipe avec cette id"})
            }
            if (results[0].Selectionneurs_id != req.tokenData.id){
                return res.status(401).send({ message : "Vous ne pouvez pas supprimer cette équipe"})
            }
            
            sql = "Delete from Equipes where id = ?"
            values = [req.body.Equipe_id]

            connection.execute(sql,values,(err,results,fields)=>{
                if (err){
                    return res.status(403).send({message : "Une erreur s'est produite lors de la suppression de l'équipe "+err.message})
                }
                return res.status(200).send({ message : "L'équipe a bien été supprimé"})
            })
        })
   }
   static removeJoueur(req, res) {
        const connection = dbconnection()

        let sql = "Select Selectionneurs_id from Equipes where id = ?; Select Equipe_id from Joueurs where User_id = ?"
        let values = [req.body.Equipe_id, req.body.Joueur_id]

        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " + err.message })
            }
            if (results.length == 0) {
                return res.status(403).send({ message: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " })
            }
            if (results[0][0].Selectionneurs_id != req.tokenData.id) {
                return res.status(401).send({ message: "Vous n'avez pas accès a cette équipe" })
            }
            if (results[1].length == 0) {
                return res.status(403).send({ message: "Le Joueur_id est invalide" })
            }
            if (results[1][0].Equipe_id == null){
                return res.status(403).send({ message: "Le Joueur n'a déja pas d'équipe" })
            }
            sql = "UPDATE Joueurs SET Equipe_id = ? WHERE User_id = ?;"
            values = [null, req.body.Joueur_id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(403).send({ message: "Une erreur s'est produite lors de la suppression du joueur a l'équipe. " + err.message })
                }
                return res.status(200).send({ message: "Le joueur a bien été retiré de l'équipe" })
            })
        })
    }
    static rename (req,res){
        const connection = dbconnection()

        let sql = "Select Selectionneurs_id from Equipes where id = ?"
        let values = [req.body.Equipe_id]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(403).send({message : "Une erreur s'est produite lors du changement de nom de l'équipe "+err.message})
            }
            if (results.length == 0){
                return res.status(403).send({ message : "Il y a aucune équipe avec cette id"})
            }
            if (results[0].Selectionneurs_id != req.tokenData.id){
                return res.status(401).send({ message : "Vous ne pouvez pas changer le nom de cette équipe"})
            }
            
            sql = "Update Equipes Set nom = ? where id = ?"
            values = [req.body.nom,req.body.Equipe_id]

            connection.execute(sql,values,(err,results,fields)=>{
                if (err){
                    return res.status(403).send({message : "Une erreur s'est produite lors du changement de nom de l'équipe "+err.message})
                }
                return res.status(200).send({ message : "Le nom de l'équipe a bien été changé"})
            })
        })
    }
}

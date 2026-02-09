const pool = require('../db/connection');

module.exports = class Equipe {

    static create(req, res) {
        

        const sql = "insert into Equipes (nom, Selectionneurs_id) values ( ?, ?)"
        const values = [req.body.nom, req.tokenData.id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    error: "Une erreur s'est produite lors de la création de l'équipe. " + err.message
                });
            }
            return res.status(200).send({ message: "Équipe créé avec succès" })
        })
    }

    static addJoueur(req, res) {
        
        let sql = "Select Selectionneurs_id from Equipes where id = ?; Select id from Joueurs where User_id = ?"
        let values = [req.body.Equipe_id, req.body.Joueur_id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Aucune Equipe avec ce Sellectionneur" })
            }
            if (results[0][0].Selectionneurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous n'avez pas accès a cette équipe" })
            }
            if (results[1].length == 0) {
                return res.status(400).send({ error: "Le Joueur_id est invalide" })
            }
            sql = "UPDATE Joueurs SET Equipe_id = ? WHERE User_id = ?;"
            values = [req.body.Equipe_id, req.body.Joueur_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de l'ajout d'un joueur a l'équipe. " + err.message })
                }
                return res.status(200).send({ message: "Le joueur a bien été ajouté dans l'équipe" })
            })
        })
    }
    static info(req, res) {
        

        const sql = `
        Select User.id,User.email,User.prenom,User.nom from User inner join Joueurs on Joueurs.User_id = User.id where Joueurs.Equipe_id = ?;
        Select id,nom from Equipes where id = ?;
        `
        const values = [req.params.id, req.params.id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des info de l'Équipe " + err.message })
            }
            if (results[1].length == 0){
                return res.status(400).send({error: "Aucune équipe avec l'id "+req.params.id})
            }

            return res.status(200).send({
                id: results[1][0].id,
                nom: results[1][0].nom,
                Joueurs : results[0]
            })
        })
    }

    static findAll(req, res) {
        ;

        let sql = "Select id,nom,Selectionneurs_id from Equipes"

        pool.execute(sql, (err, equipes, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
            }
            if (equipes.length == 0) {
                return res.status(200).send({ equipes: [] })
            }
            sql = ""
            let values = []
            equipes.forEach((equipe) => {
                sql += "Select prenom,nom from User where id = ?;"
                values.push(equipe.Selectionneurs_id)
            })
            pool.query(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des noms des équipes " + err.message })
                }
                const equipe = []
                for (let i = 0; i < results.length; i++) {
                    equipe.push({
                        id: equipes[i].id,
                        nom: equipes[i].nom,
                        Selectionneurs: results[i]
                    })
                }
                return res.status(200).send({ equipes: equipe })
            })
        })
    }
    static delete(req, res) {
        

        let sql = "Select Selectionneurs_id from Equipes where id = ?"
        let values = [req.body.Equipe_id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression de l'équipe " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucune équipe avec cette id" })
            }
            if (results[0].Selectionneurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(401).send({ error: "Vous ne pouvez pas supprimer cette équipe" })
            }

            sql = "Delete from Equipes where id = ?"
            values = [req.body.Equipe_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "L'équipe a bien été supprimé" })
            })
        })
    }
    static removeJoueur(req, res) {
        

        let sql = "Select Selectionneurs_id from Equipes where id = ?; Select Equipe_id from Joueurs where User_id = ?"
        let values = [req.body.Equipe_id, req.body.Joueur_id]

        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération de l'id du selectionneur " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Aucune equipe avec ce selectionneur" })
            }
            if (results[0][0].Selectionneurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous n'avez pas accès a cette équipe" })
            }
            if (results[1].length == 0) {
                return res.status(400).send({ error: "Le Joueur_id est invalide" })
            }
            if (results[1][0].Equipe_id == null) {
                return res.status(400).send({ error: "Le Joueur n'a déja pas d'équipe" })
            }
            sql = "UPDATE Joueurs SET Equipe_id = ? WHERE User_id = ?;"
            values = [null, req.body.Joueur_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la suppression du joueur a l'équipe. " + err.message })
                }
                return res.status(200).send({ message: "Le joueur a bien été retiré de l'équipe" })
            })
        })
    }
    static rename(req, res) {
        

        let sql = "Select Selectionneurs_id from Equipes where id = ?"
        let values = [req.body.Equipe_id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors du changement de nom de l'équipe " + err.message })
            }
            if (results.length == 0) {
                return res.status(400).send({ error: "Il y a aucune équipe avec cette id" })
            }
            if (results[0].Selectionneurs_id != req.tokenData.id && req.tokenData.type != "Admin") {
                return res.status(403).send({ error: "Vous ne pouvez pas changer le nom de cette équipe" })
            }

            sql = "Update Equipes Set nom = ? where id = ?"
            values = [req.body.nom, req.body.Equipe_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(405).send({ error: "Une erreur s'est produite lors du changement de nom de l'équipe " + err.message })
                }
                return res.status(200).send({ message: "Le nom de l'équipe a bien été changé" })
            })
        })
    }
}

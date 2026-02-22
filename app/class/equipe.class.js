const pool = require('../db/connection');
const fs = require('fs');
const path = require('path');

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
        Select id,nom,img_url from Equipes where id = ?;
        Select User.id,User.nom,User.prenom from User inner join Equipes where Equipes.Selectionneurs_id = User.id
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
                img_url: results[1][0].img_url,
                Joueurs : results[0],
                Selectionneur : results[2][0]
            })
        })
    }

    static findAll(req, res) {
        ;

        let sql = "Select id,nom,Selectionneurs_id,img_url from Equipes"

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
                        img_url: equipes[i].img_url,
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
                return res.status(403).send({ error: "Vous ne pouvez pas supprimer cette équipe" })
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

    static me(req,res){

        let sql;
        let values;

        if (req.tokenData.type == "Joueurs"){
            sql = "Select Equipe_id from Joueurs where User_id = ?"
            values = [req.tokenData.id]
        } else if (req.tokenData.type == "Selectionneurs"){
            sql = "Select id from Equipes where Selectionneurs_id = ?"
            values = [req.tokenData.id]
        } else {
            return res.status(200).send({equipe : null})
        }
        
        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération de votre équipe " + err.message })
            }
            if (results.length == 0) {
                return res.status(200).send({ equipe: [] })
            }

            sql = "Select id,nom from Equipes where id = ?"
            values = [results[0].Equipe_id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération de votre équipe " + err.message })
                }
                if (results.length == 0) {
                    return res.status(200).send({ equipe: [] })
                }
                return res.status(200).send({ equipe: results[0] })
            })
        })
    }

    static uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).send({ error: "Aucun fichier n'a été fourni" })
        }

        const uploadDir = path.join(__dirname, '../../uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = uniqueSuffix + "-" + req.file.originalname
        const filepath = path.join(uploadDir, filename)
        const imagePath = `/uploads/${filename}`

        fs.writeFile(filepath, req.file.buffer, (writeErr) => {
            if (writeErr) {
                return res.status(500).send({ error: "Erreur lors de la sauvegarde du fichier: " + writeErr.message })
            }

            const sql = "UPDATE Equipes SET img_url = ? WHERE id = ?"
            const values = [imagePath, req.params.id]

            pool.execute(sql, values, (err, results) => {
                if (err) {
                    fs.unlink(filepath, (unlinkErr) => {
                        if (unlinkErr) console.error(unlinkErr)
                    })
                    return res.status(500).send({ error: "Erreur lors de l'upload de l'image: " + err.message })
                }
                if (results.affectedRows === 0) {
                    fs.unlink(filepath, (unlinkErr) => {
                        if (unlinkErr) console.error(unlinkErr)
                    })
                    return res.status(404).send({ error: "L'équipe n'existe pas" })
                }
                return res.status(200).send({ message: "L'image a bien été uploadée", imagePath: imagePath })
            })
        })
    }

    static deleteImage(req, res) {
        const sql = "UPDATE Equipes SET img_url = NULL WHERE id = ?"
        const values = [req.params.id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la suppression de l'image: " + err.message })
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ error: "L'équipe n'existe pas" })
            }
            return res.status(200).send({ message: "L'image a bien été supprimée" })
        })
    }
}

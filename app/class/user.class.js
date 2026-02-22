const pool = require('../db/connection');
const bcrypt = require('bcrypt');
const Token = require("./token.class.js");
const connection = require('../db/connection');
const Joueur = require('./joueur.class.js');
const fs = require('fs');
const path = require('path');

module.exports = class User {

    constructor(Objet) {
        this.prenom = Objet.prenom;
        this.nom = Objet.nom;
        this.email = Objet.email;
        this.password = Objet.password;
    }

    create(res, type) {
        ;

        let sql = 'insert into User (prenom, nom, email, password) values (?, ?, ?, ?)';
        let values = [this.prenom, this.nom, this.email, bcrypt.hashSync(this.password, 10)];

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    error: "Une erreur s'est produite lors de la création de l'utilisateur. " + err.message
                });
            }
            sql = 'Select id from User where email = ?';
            values = [this.email];

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors de la récupération de l'ID de l'utilisateur." });
                }
                const id = results[0].id;

                sql = `INSERT INTO ${type} (User_id) VALUES (?)`;
                values = [id];

                pool.execute(sql, values, (err, results, fields) => {
                    if (err) {
                        return res.status(500).send({ error: "Une erreur s'est produite lors de la création de l'utilisateur." + err.message });
                    }
                    return res.status(200).send({
                        message: "Utilisateur créé avec succès."
                    });
                });
            });
        })
    }

    login(res) {
        ;

        let sql = 'select * from User where email = ?';
        let values = [this.email];

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    error: "Une erreur s'est produite lors du login. " + err.message
                });
            }
            if (results.length === 0) {
                return res.status(404).send({
                    error: "Utilisateur non trouvé."
                });
            }
            if (results[0].verified == 0) {
                return res.status(401).send({ error: "L'utilisateur n'est pas vérifié" })
            }
            const user = results[0];
            if (!bcrypt.compareSync(this.password, user.password)) {
                return res.status(401).send({
                    error: "Mot de passe incorrect."
                });
            }
            const types = ["Joueurs", "Selectionneurs", "Organisateurs", "Admin"]

            sql = "Select id from Joueurs where User_id = ?;Select id from Selectionneurs where User_id = ?;Select id from Organisateurs where User_id = ?;Select id from Admin where User_id = ?;"
            values = [user.id, user.id, user.id, user.id]

            pool.query(sql, values, (err, results) => {
                if (err) {
                    return res.status(500).send({ error: "Une erreur s'est produite lors du login. " + err.message })
                }
                let done = false;
                types.forEach((type, index) => {
                    if (results[index].length != 0 && !done) {
                        done = true
                        const token = Token.generateToken({ id: user.id, type: type })
                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "None",
                            path: "/"
                        });
                        return res.status(200).send({
                            message: "Login réussi !"
                        })
                    }
                })
            })
        });
    }

    static logout(req, res) {
        try {
            res.clearCookie("token")
        }
        catch (err) {
            res.status(500).send({ error: err.message })
        }
        res.status(200).send({ message: "Vous êtes déconnecté" })
    }

    static delete(req, res) {



        const sql = "DELETE FROM User WHERE id = ?"
        const values = [req.params.id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur l'hors de la suppression de l'utilisateur " + req.params.id + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(400).send({ error: "aucune utilisateur avec l'id " + req.params.id })
            }
            return res.status(200).send({ message: "Suppression de l'utilisateur " + req.params.id })
        })
    }

    static info(req, res) {


        let sql = `
        select id,prenom,nom,email,img_url from User where id = ?;
        select Matchs.date_heure,Matchs.lieu,Matchs.Equipe1_id,Matchs.Equipe2_id,Matchs.Tournois_id from Matchs
        left join Joueurs ON Joueurs.Equipe_id = Matchs.Equipe1_id OR Joueurs.Equipe_id = Matchs.Equipe2_id
        left join Equipes ON Joueurs.Equipe_id = Equipes.id
        left join Tournois ON Matchs.Tournois_id = Tournois.id
        where Joueurs.User_id = ?
        OR Equipes.Selectionneurs_id = ?
        OR Tournois.Organisateurs_id = ?;
        `
        let value;
        if (req.params.id) {
            value = [req.params.id, req.params.id, req.params.id, req.params.id]
        } else {
            value = [req.tokenData.id, req.tokenData.id, req.tokenData.id, req.tokenData.id]
        }

        pool.query(sql, value, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur l'hors de l'obtention des données de l'utilisateur " + err.message })
            }
            const user = results[0]
            const match = results[1] ? results[1] : results[2] ? results[2] : results[3]

            if (user == null || user == undefined) {
                return res.status(400).send({ error: "Erreur l'hors de l'obtention des données de l'utilisateur " })
            }
            if (!req.params.id && user[0]) {
                user[0].type = (req.tokenData.type)
            }
            return res.status(200).send({ user, match })
        })
    }

    static update(req, res) {


        let arg = ""
        let sql;
        let values = []

        if (req.body.prenom != null && req.body.prenom != undefined) {
            arg += "prenom = ?, "
            values.push(req.body.prenom)
        }
        if (req.body.nom != null && req.body.nom != undefined) {
            arg += "nom = ?, "
            values.push(req.body.nom)
        }

        if (arg.length === 0) {
            return res.status(400).send({ message: "Aucune donnée à mettre à jour." });
        }

        arg = arg.slice(0, -2);

        sql = "update User set " + arg + " where id = ?"
        values.push(req.params.id)

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur l'hors de la modification des données de l'utilisateur " + req.params.id + err.message })
            }

            return res.status(200).send({ message: "modification des données de l'utilisateur " + req.params.id })
        })
    }
    static getVerif(req, res) {


        let sql;

        if (req.tokenData.type == "Admin") {
            sql = "Select id from User where verified = 0"
        } else {
            sql = "SELECT User.id FROM Joueurs JOIN User ON Joueurs.User_id = User.id WHERE User.verified = 0"
        }

        pool.execute(sql, [], (err, results, field) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la récupération des utilisateurs non vérifiés. " + err.message })
            }
            return res.status(200).send({ results: results })
        })
    }
    static putVerif(req, res) {

        if (req.tokenData.type == "Admin") {
            const sql = "Update User set verified = ? where id = ?"
            const values = [req.body.value, req.body.id]

            pool.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ error: "Erreur lors de la verification" })
                }
                if (results.affectedRows == 0) {
                    return res.status(400).send({ error: "aucune colonne a été modifié" })
                }
                return res.status(200).send({ message: "L'utilisateur a bien été verifié" })
            })
        } else {
            res.status(403).send({error : "Vous ne pouvez pas vérifier des utilisateurs"})
        }
    }

    static search(req,res){
        const sql = "Select id, prenom, nom, email from User where prenom like ? or nom like ? limit 15"
        const value = ["%"+req.params.input+"%","%"+req.params.input+"%"]

        pool.execute(sql, value, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la recherche d'utilisateurs. " + err.message })
            }
            return res.status(200).send({ results: results })
        })
    }

    static changePassword(req, res) {
        const sqlSelect = "SELECT password FROM User WHERE id = ?"
        const selectValues = [req.params.id]

        pool.execute(sqlSelect, selectValues, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la vérification du mot de passe. " + err.message })
            }
            if (results.length === 0) {
                return res.status(404).send({ error: "L'utilisateur n'existe pas" })
            }

            const currentHash = results[0].password
            const isValid = bcrypt.compareSync(req.body.currentPassword, currentHash)

            if (!isValid) {
                return res.status(401).send({ error: "Mot de passe actuel incorrect." })
            }

            const newHash = bcrypt.hashSync(req.body.newPassword, 10)
            const sqlUpdate = "UPDATE User SET password = ? WHERE id = ?"
            const updateValues = [newHash, req.params.id]

            pool.execute(sqlUpdate, updateValues, (err, updateResults) => {
                if (err) {
                    return res.status(500).send({ error: "Erreur lors du changement de mot de passe. " + err.message })
                }
                if (updateResults.affectedRows === 0) {
                    return res.status(400).send({ error: "Aucune modification effectuée." })
                }
                return res.status(200).send({ message: "Mot de passe mis à jour." })
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

            const sql = "UPDATE User SET img_url = ? WHERE id = ?"
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
                    return res.status(404).send({ error: "L'utilisateur n'existe pas" })
                }
                return res.status(200).send({ message: "L'image a bien été uploadée", imagePath: imagePath })
            })
        })
    }

    static deleteImage(req, res) {
        const sql = "UPDATE User SET img_url = NULL WHERE id = ?"
        const values = [req.params.id]

        pool.execute(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la suppression de l'image: " + err.message })
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ error: "L'utilisateur n'existe pas" })
            }
            return res.status(200).send({ message: "L'image a bien été supprimée" })
        })
    }
};
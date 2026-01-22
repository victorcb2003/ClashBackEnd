const dbconnection = require('../db/connection');
const bcrypt = require('bcrypt');
const Token = require("./token.class.js");
const connection = require('../db/connection');
const match = require('./match.class.js');

module.exports = class User {

    constructor(Objet) {
        this.prenom = Objet.prenom;
        this.nom = Objet.nom;
        this.email = Objet.email;
        this.password = Objet.password;
    }

    create(res, type) {
        const connection = dbconnection();

        let sql = 'insert into User (prenom, nom, email, password) values (?, ?, ?, ?)';
        let values = [this.prenom, this.nom, this.email, bcrypt.hashSync(this.password, 10)];

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({
                    message: "Une erreur s'est produite lors de la création de l'utilisateur. " + err.message
                });
            }
            sql = 'Select id from User where email = ?';
            values = [this.email];

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération de l'ID de l'utilisateur." });
                }
                const id = results[0].id;

                sql = `INSERT INTO ${type} (User_id) VALUES (?)`;
                values = [id];

                connection.execute(sql, values, (err, results, fields) => {
                    if (err) {
                        return res.status(401).send({ message: "Une erreur s'est produite lors de la création de l'utilisateur." + err.message });
                    }
                    return res.status(201).send({
                        message: "Utilisateur créé avec succès.",
                        mdp: this.password,
                        hash: bcrypt.hashSync(this.password, 10)
                    });
                });
            });
        })
    }

    login(res) {
        const connection = dbconnection();

        let sql = 'select * from User where email = ?';
        const values = [this.email];

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                res.status(500).send({
                    message: "Une erreur s'est produite lors du login. " + err.message
                });
                return;
            }
            if (results.length === 0) {
                res.status(404).send({
                    message: "Utilisateur non trouvé."
                });
                return;
            }
            if (results[0].verified == 0) {
                return res.status(400).send({ message: "L'utilisateur n'est pas vérifié" })
            }
            const user = results[0];
            if (!bcrypt.compareSync(this.password, user.password)) {
                return res.status(401).send({
                    message: "Mot de passe incorrect."
                });
            }
            const type = ["Joueurs", "Organisateurs", "Selectionneurs", "Admin"]

            let done = false

            for (const element of type) {

                sql = "SELECT id from " + element + " WHERE User_id = ?"

                connection.query(sql, [user.id], (err, results, fields) => {
                    if (done) return

                    if (err) {
                        done = true
                        return res.status(400).send({ message: "Erreur lors de la récupération du type d'utilisateur." + err.message });
                    }
                    if (results[0] != undefined) {
                        done = true
                        const token = Token.generateToken({ id: user.id, type: element })
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
            }
        });
    }

    static logout(req,res) {
        try {
            res.clearCookie("token")
        }
        catch(err){
            res.status(400).send({message : err})
        }
        res.status(200).send({message : "Vous êtes déconnecté"})
    }

    static delete(req, res) {

        const connection = dbconnection()

        const sql = "DELETE FROM User WHERE id = ?"
        const values = [req.params.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de la suppression de l'utilisateur " + req.params.id + err.message })
            }
            if (results.affectedRows == 0) {
                return res.status(400).send({ message: "aucune utilisateur avec l'id " + req.params.id })
            }
            return res.status(200).send({ message: "Suppression de l'utilisateur " + req.params.id })
        })
    }

    static info(req, res) {
        const connection = dbconnection()

        const sql = `
        select id,prenom,nom,email from User where id = ?;
        select Matchs.date_heure,Matchs.lieu,Matchs.Equipe1_id,Matchs.Equipe2_id,Matchs.score,Matchs.Tournois_id from Matchs
        left join Joueurs ON Joueurs.Equipe_id = Matchs.Equipe1_id OR Joueurs.Equipe_id = Matchs.Equipe2_id
        left join Equipes ON Joueurs.Equipe_id = Equipes.id
        left join Tournois ON Matchs.Tournois_id = Tournois.id
        where Joueurs.User_id = ?
        OR Equipes.Selectionneurs_id = ?
        OR Tournois.Organisateurs_id = ?;
        `

        const value = [req.tokenData.id,req.tokenData.id,req.tokenData.id,req.tokenData.id]

        connection.query(sql, value, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id + err.message })
            }
            const user = results[0]
            const match = results[1] ? results[1] : results[2] ? results[2] : results[3]

            if (user == null || user == undefined) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id })
            }
            user[0].type = (req.tokenData.type)
            return res.status(200).send({ user,match })
        })
    }

    static update(req, res) {
        const connection = dbconnection()

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

        if (req.body.password != null && req.body.password != undefined) {
            arg += "password = ?, "
            values.push(bcrypt.hashSync(req.body.password, 10))
        }

        if (arg.length === 0) {
            return res.status(400).send({ message: "Aucune donnée à mettre à jour." });
        }

        arg = arg.slice(0, -2);

        sql = "update User set " + arg + " where id = " + req.tokenData.id


        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de la modification des données de l'utilisateur " + req.tokenData.id + err.message })
            }

            return res.status(200).send({ message: "modification des données de l'utilisateur " + req.tokenData.id })
        })
    }
    static getVerif(req, res) {
        const connection = dbconnection()

        let sql;

        if (req.tokenData.type == "Admin") {
            sql = "Select id from User where verified = 0"
        } else {
            sql = "SELECT User.id FROM Joueurs JOIN User ON Joueurs.User_id = User.id WHERE User.verified = 0"
        }

        connection.execute(sql, [], (err, results, field) => {
            if (err) {
                return res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs non vérifiés. " + err.message })
            }
            return res.status(200).send({ results: results })
        })
    }
    static putVerif(req, res) {
        const connection = dbconnection()

        if (req.tokenData.type == "Admin") {
            const sql = "Update User set verified = ? where id = ?"
            const values = [req.body.value, req.body.id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(400).send({ message: "Erreur lors de la verification" })
                }
                if (results.affectedRows == 0) {
                    return res.status(400).send({ message: "aucune colonne a été modifié" })
                }
                return res.status(200).send({ message: "L'utilisateur a bien été verifié" })
            })
        } else {

            let sql = "SELECT User.id FROM Joueurs JOIN User ON Joueurs.User_id = User.id WHERE User.id = ?"
            let values = [req.body.id]

            connection.execute(sql, values, (err, results, fields) => {
                if (err) {
                    return res.status(400).send({ message: "Erreur lors de la verification. " + err })
                }
                if (results.length == 0) {
                    return res.status(400).send({ message: "Vous ne pouvez pas verifier cette utilisateur" })
                } else {
                    sql = "Update User set verified = ? where id = ?"
                    values = [req.body.value, req.body.id]

                    connection.execute(sql, values, (err, results, fields) => {
                        if (err) {
                            return res.status(400).send({ message: "Erreur lors de la verification. " + err })
                        }
                        if (results.affectedRows == 0) {
                            return res.status(400).send({ message: "aucune colonne a été modifié" })
                        }
                        return res.status(200).send({ message: "L'utilisateur a bien été verifié" })
                    })
                }
            })
        }
    }
};
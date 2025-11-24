const dbconnection = require('../db/connection');
const bcrypt = require('bcrypt');
const Token = require("./token.class.js");
const connection = require('../db/connection');

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
                res.status(401).send({
                    message: "Mot de passe incorrect."
                });
                return;
            }
            const type = ["Joueurs", "Organisateurs", "Selectionneurs", "Admin"]

            for (const element of type) {

                sql = "SELECT id from " + element + " WHERE User_id = ?"

                connection.query(sql, [user.id], (err, results, fields) => {
                    if (err) {
                        res.status(400).send({ message: "Erreur lors de la récupération du type d'utilisateur." + err.message });
                    }
                    if (results[0] != undefined) {
                        const token = Token.generateToken({id: user.id,type: element})
                        res.status(200).send({
                            message: "Login réussi !",
                            token
                        })
                        .cookie(
                            "token", 
                            token,
                            {  
                            maxAge: 60 * 60 * 1000 
                            }
                        );
                    }
                })
            }
        });
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

        const sql = "select id,prenom,nom,email from User where id = ?"
        const value = req.tokenData.id

        connection.query(sql, value, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id + err.message })
            }
            const user = results[0]

            if (user == null || user == undefined) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id })
            }
            return res.status(200).send({ user })
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
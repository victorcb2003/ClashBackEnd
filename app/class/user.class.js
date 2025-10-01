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
                    return res.status(201).send({ message: "Utilisateur créé avec succès." });
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
            const user = results[0];
            if (!bcrypt.compareSync(this.password, user.password)) {
                res.status(401).send({
                    message: "Mot de passe incorrect."
                });
                return;
            }
            const type = ["Joueurs", "Organisateurs", "Selectionneurs"]

            for (const element of type) {

                sql = "SELECT id from " + element + " WHERE User_id = ?"

                connection.query(sql, [user.id], (err, results, fields) => {
                    if (err) {
                        res.status(400).send({ message: "Erreur lors de la récupération du type d'utilisateur." + err.message });
                    }
                    if (results[0] != undefined) {
                        res.status(200).send({
                            message: "Login réussi !",
                            token: Token.generateToken({ 
                                id: user.id,
                                type: element
                             })
                        });
                    }
                })
            }
        });
    }

    static delete(req, res) {

        const connection = dbconnection()

        const sql = "DELETE FROM User WHERE id = ?"
        const values = [req.tokenData.id]

        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de la suppression de l'utilisateur " + req.tokenData.id + err.message })
            }
            return res.status(200).send({ message: "Suppression de l'utilisateur " + req.tokenData.id })
        })
    }

    static info(req, res) {
        const connection = dbconnection()

        const sql = "select prenom,nom,email from User where id =" + req.tokenData.id

        connection.query(sql, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id + err.message })
            }
            const data = results[0]

            if (data == null || data == undefined) {
                return res.status(401).send({ message: "Erreur l'hors de l'obtention des données de l'utilisateur " + req.tokenData.id })
            }
            return res.status(200).send({ data })
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

        sql = "update User set " + arg + " where id = "+req.tokenData.id


        connection.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(401).send({ message: "Erreur l'hors de la modification des données de l'utilisateur " + req.tokenData.id + err.message })
            }

            return res.status(200).send({ message: "modification des données de l'utilisateur " + req.tokenData.id })
        })
    }
};
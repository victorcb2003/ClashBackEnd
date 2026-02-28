const pool = require('../db/connection');
const bcrypt = require('bcrypt');
const Mail = require("../mail/form.mail")
const Token = require("../class/token.class.js")
const User = require("../class/user.class.js")

module.exports = class Form {

    static post(req,res){
        
        const sql = "INSERT INTO Forms (prenom, nom, email,Utype) values (?,?,?,?)"
        const values = [req.body.prenom, req.body.nom, req.body.email, req.body.type]

        pool.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(500).send({ error : err.message})
            }
            Mail.sendConfirmationEmail(req,res)
        })
    }

    static get(req,res){
        
        const sql = "Select * from Forms"

        pool.execute(sql,(err,results,fields)=>{
            if (err){
                return res.status(500).send({ error : err.message})
            }
            return res.status(200).send({results})
        })
    }
    
    static confirm(req, res) {
        const token =  Token.verifyToken(req.body.token,res);

        if (!token.email || !token.prenom || !token.nom || !token.type) {
            return res.status(403).send({ error: "Accès non autorisé." });
        }

        const user = new User({
            prenom: token.prenom,
            nom: token.nom,
            email: token.email,
            password: req.body.password
        });

        user.create(res, token.type);
    }

    static resetPassword(req, res) {
        if (!req.body.email) {
            return res.status(400).send({ error: "req.body.email est requis." });
        }

        const sql = "Select id, prenom,nom from User where email = ?"
        const values = [req.body.email]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la réinitialisation du mot de passe. " + err.message })
            }
            if (results.length == 0) {
                return res.status(404).send({ error: "Aucun utilisateur trouvé avec cet email." })
            }

            const user = {
                id: results[0].id,
                prenom: results[0].prenom,
                nom: results[0].nom,
                email: req.body.email
            }

            Mail.sendResetPassword(req, res, user)
        })
    }

    static confirmResetPassword(req, res) {
        const token =  Token.verifyToken(req.body.token,res);

        if (!token.id) {
            return res.status(403).send({ error: "Accès non autorisé." });
        }

        const sql = "Update User Set password = ? where id = ?"
        const values = [bcrypt.hashSync(req.body.password,10), token.id]

        pool.execute(sql, values, (err, results, fields) => {
            if (err) {
                return res.status(500).send({ error: "Une erreur s'est produite lors de la réinitialisation du mot de passe. " + err.message })
            }
            return res.status(200).send({ message: "Mot de passe réinitialisé avec succès." })
        })
    }
}
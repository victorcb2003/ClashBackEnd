const dbconnection = require('../db/connection');
const Mail = require("../mail/form.mail")
const Token = require("../class/token.class.js")
const User = require("../class/user.class.js")

module.exports = class Form {

    static post(req,res){
        const connection = dbconnection()
        const sql = "INSERT INTO Forms (prenom, nom, email,Utype) values (?,?,?,?)"
        const values = [req.body.prenom, req.body.nom, req.body.email, req.body.type]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(400).send({message : err.message})
            }
            Mail.sendMail(req,res)
        })
    }

    static get(req,res){
        const connection = dbconnection()
        const sql = "Select * from Forms"

        connection.execute(sql,(err,results,fields)=>{
            if (err){
                return res.status(400).send({message : err.message})
            }
            return res.status(200).send({message : results})
        })
    }
    
    static confirm(req, res) {
        const token =  Token.verifyToken(req.body.token,res);

        if (!token.email || !token.prenom || !token.nom || !token.type) {
            return res.status(400).send({ message: "Accès non autorisé." });
        }

        const user = new User({
            prenom: token.prenom,
            nom: token.nom,
            email: token.email,
            password: req.body.password
        });

        user.create(res, token.type);
    }
}
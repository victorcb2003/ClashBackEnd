const dbconnection = require('../db/connection');
const Mail = require("../mail/form.mail")
const Token = require("../class/token.class.js")

module.exports = class Form {

    static post(req,res){
        const connection = dbconnection()
        const sql = "INSERT INTO Forms (prenom, nom, email) values (?,?,?)"
        const values = [req.body.prenom, req.body.nom, req.body.email]

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
        res.status(200).send({ message: Token.verifyToken(req.params.token,res) });
    }
}
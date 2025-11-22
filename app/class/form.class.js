const dbconnection = require('../db/connection');
const Form = require("../mail/form.mail")

module.exports = class Form {

    static post(req,res){
        const connection = dbconnection()
        const sql = "INSERT INTO Forms (prenom, nom, email) values (?,?,?)"
        values = [req.body.prenom, req.body.nom, req.body.email]

        connection.execute(sql,values,(err,results,fields)=>{
            if (err){
                return res.status(400).send({message : err.message})
            }
            Form.sendMail(req,res)
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
}
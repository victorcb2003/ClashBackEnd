const dbconnection = require('../db/connection');

module.exports = class match {
    static create(req,res){
        const connection = dbconnection()

        sql = "inser into Matchs date_heure,lieu,tour values (?,?,?);"
        values = [req.data.date_heure,req.data.lieu,req.data.tour]

        connection.execute(sql,values,(err,results)=>{
            if (err){
                return res.status(403).send({message : "Érreur lors de la création d'un match "+err.message})
            }
        })
    }
}
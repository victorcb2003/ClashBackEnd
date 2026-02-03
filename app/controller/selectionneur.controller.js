const Selectionneur = require("../class/selectionneur.class.js");

exports.findAll = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  }
  Selectionneur.findAll(req,res)
}
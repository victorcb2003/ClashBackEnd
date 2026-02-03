const Organisateur = require("../class/organisateur.class.js");

exports.findAll = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  }
  Organisateur.findAll(req,res)
}
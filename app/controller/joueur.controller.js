const Joueur = require("../class/joueur.class.js");

exports.findAll = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  }
  Joueur.findAll(req,res)
}

exports.info = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  }
  if (!req.params.id ){
    return res.status(400).send({message : "req.params.id est requis."})
  }
  Joueur.info(req,res)
}
const Equipe = require("../class/equipe.class.js");

exports.create = (req, res) => {
    if (req.tokenData.type != "Selectionneurs"){
        return res.status(401).send({message : "Route non autorisée"})
    }
    if (req.body.nom == null){
        return res.status(403).send({message : "req.body.nom est undefined"})
    }

    Equipe.create(req,res)
};

exports.delete = (req,res) =>{
  if (!req.params.id){
    return res.status(401).send({message : "params.id est vide"})
  }

};

exports.findAll = (req,res) =>{

}

exports.addJoueur = (req,res) =>{
    if (req.tokenData.type != "Selectionneurs"){
        return res.status(401).send({message : "Route non autorisée"})
    }
    if (!req.body.Joueur_id){
        return res.status(403).send({message : "req.body.User_id est vide"})
    }
    if (!req.body.Equipe_id){
        return res.status(403).send({message : "req.body.Equipe_id est vide"})
    }

    Equipe.addJoueur(req,res)
}

exports.removeJoueur = (req,res) =>{
    if (req.tokenData.type != "Selectionneurs"){
        return res.status(401).send({message : "Route non autorisée"})
    }
    if (!req.body.Joueur_id){
        return res.status(403).send({message : "req.body.User_id est vide"})
    }
    if (!req.body.Equipe_id){
        return res.status(403).send({message : "req.body.Equipe_id est vide"})
    }

    Equipe.removeJoueur(req,res)
}

exports.info = (req,res)=>{
    if (!req.params.id){
        return res.status(403).send({message : "req.params.id est vide"})
    }

    Equipe.info(req,res)
}

exports.findAll = (req, res)=>{

    Equipe.findAll(req, res)
}

exports.delete = (req,res) =>{
    if (req.tokenData.type != "Selectionneurs"){
        return res.status(401).send({message : "Route non autorisée"})
    }
    if (!req.body.Equipe_id){
        return res.status(403).send({message : "req.body.Equipe_id est vide"})
    }

    Equipe.delete(req,res)
}
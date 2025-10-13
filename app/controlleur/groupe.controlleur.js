const Groupe = require("../class/groupe.class.js");

exports.create = (req, res) => {
    if (req.tokenData == null){
        return res.status(401).send({message : "invalide token"})
    }
    if (!req.body.nom){
        return res.status(403).send({message : "req.body.nom est undefined"})
    }

    Groupe.create(req,res)
};

exports.add = (req,res) =>{
    if (req.tokenData == null){
        return res.status(401).send({message : "invalide token"})
    }
    if (!req.body.user_id){
        return res.status(403).send({message : "req.body.user_id est vide"})
    }
    if (!req.body.groupe_id){
        return res.status(403).send({message : "req.body.groupe_id est vide"})
    }

    Groupe.add(req,res)
}

exports.remove = (req,res) =>{
    if (req.tokenData == null){
        return res.status(401).send({message : "invalide token"})
    }
    if (!req.body.user_id){
        return res.status(403).send({message : "req.body.user_id est vide"})
    }
    if (!req.body.groupe_id){
        return res.status(403).send({message : "req.body.groupe_id est vide"})
    }

    Groupe.remove(req,res)
}

exports.info = (req,res)=>{
    if (!req.params.id){
        return res.status(403).send({message : "req.params.id est vide"})
    }

    Groupe.info(req,res)
}

exports.findAll = (req, res)=>{

    Groupe.findAll(req, res)
}

exports.delete = (req,res) =>{
    if (req.tokenData == null){
        return res.status(401).send({message : "invalide token"})
    }
    if (!req.body.groupe_id){
        return res.status(403).send({message : "req.body.groupe_id est vide"})
    }

    Groupe.delete(req,res)
}

exports.rename = (req,res) =>{
    if (req.tokenData == null){
        return res.status(401).send({message : "Route non autorisée"})
    }
    if (!req.body.groupe_id){
        return res.status(403).send({message : "req.body.groupe_id est vide"})
    }
    if (!req.body.nom){
        return res.status(403).send({message : "req.body.nom est vide"})
    }

    Groupe.rename(req,res)
}
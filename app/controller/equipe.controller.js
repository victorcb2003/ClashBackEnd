const Equipe = require("../class/equipe.class.js");

exports.create = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.body.nom){
        return res.status(400).send({error : "req.body.nom est undefined"})
    }
    if (!(typeof(req.body.nom) == "string")) {
        return res.status(400).send({error : "req.body.nom n'est pas un string"})
    }

    Equipe.create(req,res)
};

exports.addJoueur = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.body.Joueur_id){
        return res.status(400).send({error : "req.body.User_id est requis."})
    }
    if (!req.body.Equipe_id){
        return res.status(400).send({error : "req.body.Equipe_id est requis."})
    }

    Equipe.addJoueur(req,res)
}

exports.removeJoueur = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.body.Joueur_id){
        return res.status(400).send({error : "req.body.User_id est requis."})
    }
    if (!req.body.Equipe_id){
        return res.status(400).send({error : "req.body.Equipe_id est requis."})
    }
    Equipe.removeJoueur(req,res)
}

exports.info = (req,res)=>{
    if (!req.tokenData){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({error : "req.params est requis."})
    }

    Equipe.info(req,res)
}

exports.findAll = (req, res)=>{
    if (!req.tokenData){
        return res.status(401).send({error : "Accès non autorisé."})
    }

    Equipe.findAll(req, res)
}

exports.delete = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.body.Equipe_id){
        return res.status(400).send({error : "req.body.Equipe_id est requis."})
    }

    Equipe.delete(req,res)
}

exports.rename = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.body.Equipe_id){
        return res.status(400).send({error : "req.body.Equipe_id est requis."})
    }
    if (!req.body.nom){
        return res.status(400).send({error : "req.body.nom est requis."})
    }

    Equipe.rename(req,res)
}

exports.me = (req,res) =>{
    if (!req.tokenData){
        return res.status(403).send({error : "Accès non autorisé."})
    }

    Equipe.me(req,res)
}

exports.uploadImage = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({error : "req.params.id est requis."})
    }
    if (!req.file){
        return res.status(400).send({error : "req.file est requis."})
    }

    Equipe.uploadImage(req, res)
}

exports.deleteImage = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({error : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({error : "req.params.id est requis."})
    }

    Equipe.deleteImage(req, res)
}
const Groupe = require("../class/groupe.class.js");

exports.create = (req, res) => {
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.body.nom){
        return res.status(400).send({message : "req.body.nom est undefined"})
    }

    Groupe.create(req,res)
};

exports.add = (req,res) =>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.body.user_id){
        return res.status(400).send({message : "req.body.user_id est requis."})
    }
    if (!req.body.groupe_id){
        return res.status(400).send({message : "req.body.groupe_id est requis."})
    }

    Groupe.add(req,res)
}

exports.remove = (req,res) =>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.body.user_id){
        return res.status(400).send({message : "req.body.user_id est requis."})
    }
    if (!req.body.groupe_id){
        return res.status(400).send({message : "req.body.groupe_id est requis."})
    }

    Groupe.remove(req,res)
}

exports.info = (req,res)=>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({message : "req.params.id est requis."})
    }

    Groupe.info(req,res)
}

exports.findAll = (req, res)=>{

    Groupe.findAll(req, res)
}

exports.delete = (req,res) =>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({message : "req.params.id est requis."})
    }

    Groupe.delete(req,res)
}

exports.rename = (req,res) =>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.body.groupe_id){
        return res.status(400).send({message : "req.body.groupe_id est requis."})
    }
    if (!req.body.nom){
        return res.status(400).send({message : "req.body.nom est requis."})
    }

    Groupe.rename(req,res)
}

exports.messageCreate = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.body.groupe_id){
        return res.status(400).send({message : "req.body.groupe_id est requis."})
    }
    if (!req.body.message){
        res.status(400).send({message : "req.body.message est requis."})
    }

    Groupe.messageCreate(req, res);
};

exports.messageDelete = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.params.id) {
        return res.status(400).send({ message: "params.id est requis." })
    }

    Groupe.messageDelete(req, res)
};

exports.messageFindAll = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.params.id) {
        return res.status(400).send({ message: "params.id est requis." })
    }

    Groupe.messageFindAll(req, res)
}

exports.messageUpdate = (req,res)=>{
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.body.message_id){
        res.status(400).send({message : "req.body.message_id est requis."})
    }
    if (!req.body.message){
        res.status(400).send({message : "req.body.message est requis."})
    }

    Groupe.messageUpdate(req,res)
}
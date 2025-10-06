const Tournois = require("../class/tournois.class.js");

exports.create = (req, res) => {
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.nom) {
        return res.status(403).send({ message: "req.body.nom est vide" })
    }
    if (!req.body.date) {
        return res.status(403).send({ message: "req.body.date est vide" })
    }
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(req.body.date)) {
        return res.status(403).send({ message: "req.body.date est pas au format YYYY-MM-DD" })
    }
    if (!req.body.lieu) {
        return res.status(403).send({ message: "req.body.lieu est vide" })
    }

    Tournois.create(req, res)
};

exports.info = (req, res) => {
    if (!req.params.id) {
        return res.status(403).send({ message: "req.params.id est vide" })
    }

    Tournois.info(req, res)
}

exports.findAll = (req, res) => {
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }

    Tournois.findAll(req, res)
}

exports.delete = (req, res) => {
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Tournois_id) {
        return res.status(403).send({ message: "req.body.Tournois_id est vide" })
    }

    Tournois.delete(req, res)
}

exports.update = (req, res) => {
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Tournois_id) {
        return res.status(403).send({ message: "req.body.Tournois_id est vide" })
    }
    if (req.body.date) {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regex.test(req.body.date)) {
            return res.status(403).send({ message: "req.body.date est pas au format YYYY-MM-DD" })
        }
    }

    if (!req.body.nom && !req.body.date && !req.body.lieu) {
        return res.status(403).send({ message: "Il faut au moins remplir req.body.nom ou req.body.date ou req.body.lieu" })
    }

    Tournois.update(req, res)
}

exports.addEquipe = (req ,res) => {
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Tournois_id) {
        return res.status(403).send({ message: "req.body.Tournois_id est vide" })
    }
    if (!req.body.Equipe_id) {
        return res.status(403).send({ message: "req.body.Equipe_id est vide" })
    }
    Tournois.addEquipe(req,res)
}

exports.removeEquipe = (req ,res) => {
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Tournois_id) {
        return res.status(403).send({ message: "req.body.Tournois_id est vide" })
    }
    if (!req.body.Equipe_id) {
        return res.status(403).send({ message: "req.body.Equipe_id est vide" })
    }
    Tournois.removeEquipe(req,res)
}

exports.info = (req,res)=>{
    if (!req.params.id){
        return res.status(403).send({message : "req.params.id est vide"})
    }

    Tournois.info(req,res)
}

exports.start = (req,res) =>{
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Tournois_id) {
        return res.status(403).send({ message: "req.body.Tournois_id est vide" })
    }

    Tournois.start(req,res)
}
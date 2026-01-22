const Match = require("../class/match.class")

exports.findAll = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "token invalide" })
    }
    if (!req.params.id){
        return res.status(401).send({ message: "req.params.id est vide" })
    }

    Match.findAll(req, res)
}

exports.update = (req,res)=>{
    if (!req.tokenData || req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Match_id){
        return res.status(403).send({ message: "req.body.Match_id est vide" })
    }
    if (!req.body.Equipe1_id && !req.body.Equipe2_id && !req.body.score && !req.body.lieu && !req.body.date_heure){
        return res.status(403).send({ message: "Aucun argument valide dans req.body" })
    }
    if (req.body.score && req.body.score.match(/^\d+-\d+$/)==null){
        return res.status(403).send({ message : "le score doit être du format 'n-n' avec n un nombre"})
    }
    if (req.body.date_heure && !regex.test(req.body.date_heure)) {
        return res.status(403).send({ message: "req.body.date est pas au format YYYY-MM-DD" })
    }


    Match.update(req,res)
}

exports.create = (req,res)=>{

    if (!req.tokenData || req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Equipe1_id) {
        return res.status(403).send({ message: "req.body.Equipe1_id est vide" })
    }
    if (!req.body.Equipe2_id) {
        return res.status(403).send({ message: "req.body.Equipe2_id est vide" })
    }
    if (!req.body.date_heure) {
        return res.status(403).send({ message: "req.body.date_heure est vide" })
    }
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
;
    if (!regex.test(req.body.date_heure)) {
        return res.status(403).send({ message: "req.body.date est pas au format YYYY-MM-DD" })
    }
    if (!req.body.lieu) {
        return res.status(403).send({ message: "req.body.lieu est vide" })
    }

    Match.create(req,res)
}

exports.getById = (req,res)=>{
    if (!req.tokenData){
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.params.id){
        return res.status(403).send({ message: "req.params.id est vide" })
    }

    Match.getById(req,res)
}
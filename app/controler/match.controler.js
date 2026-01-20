const Match = require("../class/match.class")

exports.findAll = (req, res) => {
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }
    if (!req.params.id){
        return res.status(401).send({ message: "req.params.id est vide" })
    }

    Match.findAll(req, res)
}

exports.update = (req,res)=>{
    if (req.tokenData.type != "Organisateurs") {
        return res.status(401).send({ message: "Route non autorisée" })
    }
    if (!req.body.Match_id){
        return res.status(403).send({ message: "req.body.Match_id est vide" })
    }
    if (!req.body.Equipe1_id && !req.body.Equipe2_id && !req.body.score && !req.body.lieu && !req.body.date_heure){
        return res.status(403).send({ message: "Aucun argument valide dans req.body" })
    }

    Match.update(req,res)
}
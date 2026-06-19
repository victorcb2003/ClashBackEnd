const Selec = require("../class/selec.class.js")

exports.addJoueur = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error: "Accès non autorisé." })
    }
    if (!req.body.Joueur_id) {
        return res.status(400).send({ error: "req.body.Joueur_id est requis." })
    }
    if (parseInt(req.body.Joueur_id) != req.body.Joueur_id) {
        return res.status(400).send({ error: "req.body.Joueur_id n'est pas un entier." })
    }
    if (!req.body.Match_id) {
        return res.status(400).send({ error: "req.body.Match_id est requis." })
    }
    if (parseInt(req.body.Match_id) != req.body.Match_id) {
        return res.status(400).send({ error: "req.body.Match_id n'est pas un entier." })
    }
    if (!req.body.Equipe_id) {
        return res.status(400).send({ error: "req.body.Equipe_id est requis." })
    }
    if (parseInt(req.body.Equipe_id) != req.body.Equipe_id) {
        return res.status(400).send({ error: "req.body.Equipe_id n'est pas un entier." })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error: "req.body.Tournois_id est requis." })
    }
    if (parseInt(req.body.Tournois_id) != req.body.Tournois_id) {
        return res.status(400).send({ error: "req.body.Tournois_id n'est pas un entier." })
    }

    Selec.addJoueur(req, res)
}

exports.removeJoueur = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error: "Accès non autorisé." })
    }
    if (!req.body.Joueur_id) {
        return res.status(400).send({ error: "req.body.Joueur_id est requis." })
    }
    if (parseInt(req.body.Joueur_id) != req.body.Joueur_id) {
        return res.status(400).send({ error: "req.body.Joueur_id n'est pas un entier." })
    }
    if (!req.body.Match_id) {
        return res.status(400).send({ error: "req.body.Match_id est requis." })
    }
    if (parseInt(req.body.Match_id) != req.body.Match_id) {
        return res.status(400).send({ error: "req.body.Match_id n'est pas un entier." })
    }

    Selec.removeJoueur(req, res)
}

exports.findByMatch = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ error: "Accès non autorisé." })
    }
    if (!req.params.match_id) {
        return res.status(400).send({ error: "req.params.match_id est requis." })
    }
    if (parseInt(req.params.match_id) != req.params.match_id) {
        return res.status(400).send({ error: "req.params.match_id n'est pas un entier." })
    }

    Selec.findByMatch(req, res)
}
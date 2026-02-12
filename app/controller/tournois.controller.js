const Tournois = require("../class/tournois.class.js");

exports.create = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/create" })
    }
    if (!req.body.nom) {
        return res.status(400).send({ error : "req.body.nom est requis." })
    }
    if (!req.body.date) {
        return res.status(400).send({ error : "req.body.date est requis." })
    }
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(req.body.date)) {
        return res.status(400).send({ error : "req.body.date est pas au format 'YYYY-MM-DD'" })
    }
    if (!req.body.lieu) {
        return res.status(400).send({ error : "req.body.lieu est requis." })
    }

    Tournois.create(req, res)
};

exports.info = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ error : "Accès non autorisé.tournois/info" })
    }
    if (!req.params.id) {
        return res.status(400).send({ error : "req.params.id est requis." })
    }

    Tournois.info(req, res)
}

exports.findAll = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ error : "Accès non autorisé. tournois/findAll" })
    }

    Tournois.findAll(req, res)
}

exports.delete = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/delete" })
    }
    if (!req.params.id) {
        return res.status(400).send({ error : "req.params.id est requis." })
    }

    Tournois.delete(req, res)
}

exports.update = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/update" })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error : "req.body.Tournois_id est requis." })
    }
    if (req.body.date) {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regex.test(req.body.date)) {
            return res.status(400).send({ error : "req.body.date est pas au format 'YYYY-MM-DD'" })
        }
    }

    if (!req.body.nom && !req.body.date && !req.body.lieu) {
        return res.status(400).send({ error : "Il faut au moins remplir req.body.nom ou req.body.date ou req.body.lieu" })
    }

    Tournois.update(req, res)
}

exports.addEquipe = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/addEquipe" })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error : "req.body.Tournois_id est requis." })
    }
    if (!req.body.Equipe_id) {
        return res.status(400).send({ error : "req.body.Equipe_id est requis." })
    }
    Tournois.addEquipe(req, res)
}

exports.removeEquipe = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/removeEquipe" })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error : "req.body.Tournois_id est requis." })
    }
    if (!req.body.Equipe_id) {
        return res.status(400).send({ error : "req.body.Equipe_id est requis." })
    }
    Tournois.removeEquipe(req, res)
}

exports.start = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin") {
        return res.status(403).send({ error : "Accès non autorisé. tournois/start" })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error : "req.body.Tournois_id est requis." })
    }

    Tournois.start(req, res)
}
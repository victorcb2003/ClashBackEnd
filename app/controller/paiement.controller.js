const Paiement = require("../class/paiement.class.js")

// Ici je vérifie que l'utilisateur est connecté et que la demande de paiement est complète
exports.create = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ error: "Accès non autorisé." })
    }
    if (!req.body.Tournois_id) {
        return res.status(400).send({ error: "req.body.Tournois_id est requis." })
    }
    if (!req.body.ModePaiement_id) {
        return res.status(400).send({ error: "req.body.ModePaiement_id est requis." })
    }
    if (!req.body.montant) {
        return res.status(400).send({ error: "req.body.montant est requis." })
    }

    Paiement.create(req, res)
}

// Ici je renvoie les modes de paiement à l'utilisateur connecté
exports.modes = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ error: "Accès non autorisé." })
    }

    Paiement.modes(req, res)
}
const Form = require("../class/form.class.js");

exports.post = (req, res) => {
    if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.type) {
        return res.status(400).send({
            error: "Veuillez remplir tous les champs !"
        });
    }

    if (req.body.type != "Joueur" && req.body.type != "Selectionneurs" && req.body.type != "Organisateur") {
        return res.status(400).send({
            error: "Type d'utilisateur invalide."
        });
    }

    Form.post(req,res)
}

exports.confirm = (req, res) => {
    if (!req.body.token) {
        return res.status(400).send({error: "Le token est pas dans le body"});
    }
    if (!req.body.password) {
        return res.status(400).send({error: "Le password n'est pas dans le body"});
    }

    Form.confirm(req, res)
}

exports.confirmResetPassword = (req, res) => {
    if (!req.body.token) {
        return res.status(400).send({error: "Le token est pas dans le body"});
    }
    if (!req.body.password) {
        return res.status(400).send({error: "Le password n'est pas dans le body"});
    }

    Form.confirmResetPassword(req, res)
}

exports.resetPassword = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({error: "Le email est pas dans le body"});
    }

    Form.resetPassword(req, res)
}
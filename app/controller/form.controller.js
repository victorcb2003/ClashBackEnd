const Form = require("../class/form.class.js");

exports.post = (req, res) => {
    if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.type) {
        return res.status(400).send({
            error: "Veuillez remplir tous les champs !"
        });
    }

    Form.post(req,res)
}

exports.get = (req, res)=>{
    if (!req.tokenData || req.tokenData.type != "Admin"){
        return res.status(403).send({
            error: "Accès non autorisé."
        });
    }

    Form.get(req,res)
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
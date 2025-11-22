const Form = require("../class/form.class.js");

exports.post = (req, res) => {
    if (!req.body.prenom || !req.body.nom || !req.body.email) {
        return res.status(400).send({
            message: "Veuillez remplir tous les champs !"
        });
    }

    Form.post(req,res)
}

exports.get = (req, res)=>{
    if (req.tokenData == null || req.tokenData.type != "Admin"){
        return res.status(400).send({
            message: "token invalide"
        });
    }

    Form.get(req,res)
}

exports .confirm = (req, res) => {
    if (!req.params.token) {
        return res.status(400).send({message: "Le token est manquant"});
    }
    if (req.tokenData != null) {
        return res.status(400).send({message: "Token invalide"});
    }

    Form.confirm(req, res)
}
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

exports.confirm = (req, res) => {
    if (!req.body.token) {
        return res.status(400).send({message: "Le token est manquant"});
    }

    Form.confirm(req, res)
}
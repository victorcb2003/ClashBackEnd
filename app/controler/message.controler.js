const Message = require("../class/message.class.js");

exports.create = (req, res) => {
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }
    if (!req.body.message || !req.body.destinataire_id) {
        return res.status(406).send({message: "Veuillez remplir tous les champs !"});
    }

    Message.create(req, res);
};

exports.delete = (req, res) => {
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }
    if (!req.params.id) {
        return res.status(406).send({ message: "params.id est vide" })
    }

    Message.delete(req, res)
};

exports.findAll = (req, res) => {
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }

    Message.findAll(req, res)
}

exports.update = (req,res)=>{
    if (req.tokenData == null) {
        return res.status(401).send({ message: "token invalide" })
    }
    if (!req.body.message_id){
        res.status(406).send({message : "req.body.message_id est vide"})
    }
    if (!req.body.message){
        res.status(406).send({message : "req.body.message est vide"})
    }

    Message.update(req,res)
}

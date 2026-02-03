const Message = require("../class/message.class.js");

exports.create = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.body.message || !req.body.destinataire_id) {
        return res.status(400).send({message: "Veuillez remplir tous les champs !"});
    }

    Message.create(req, res);
};

exports.delete = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.params.id) {
        return res.status(400).send({ message: "params.id est requis." })
    }

    Message.delete(req, res)
};

exports.findAll = (req, res) => {
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }

    Message.findAll(req, res)
}

exports.update = (req,res)=>{
    if (!req.tokenData) {
        return res.status(401).send({ message: "Accès non autorisé." })
    }
    if (!req.body.message_id){
        res.status(400).send({message : "req.body.message_id est requis."})
    }
    if (!req.body.message){
        res.status(400).send({message : "req.body.message est requis."})
    }

    Message.update(req,res)
}

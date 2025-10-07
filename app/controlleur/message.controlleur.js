const message = require("../class/message.class.js");

exports.create = (req, res) => {
  if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Veuillez remplir tous les champs !"
    });
  }

  message.create(res, "messages");
};

exports.delete = (req,res) =>{
  if (!req.params.id){
    return res.status(401).send({message : "params.id est vide"})
  }

  if (req.tokenData == null && typeof(req.tokenData.id) == 'number'){
    return res.status(401).send({message : "token invalide"})
  } 

  if (req.tokenData.id != req.params.id ){
    return res.status(403).send({message : "route non autorisée"})
  }
  message.delete(req,res)
};

exports.findAll = (req,res) =>{
  if (req.tokenData == null){
    return res.status(401).send({message : "token invalide"})
  }
  message.findAll(req,res)
}

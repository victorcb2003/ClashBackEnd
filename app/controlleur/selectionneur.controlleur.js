const Selectionneur = require("../class/selectionneur.class.js");

exports.create = (req, res) => {
  if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Veuillez remplir tous les champs !"
    });
    return;
  }

  const selectionneur = new Selectionneur({
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    password: req.body.password
  });

  selectionneur.create(res, "Selectionneurs");
};

exports.delete = (req,res) =>{
  if (!req.params.id){
    return res.status(401).send({message : "params.id est vide"})
  }

  if (req.header.dataToken == null){
    return res.status(401).send({message : "token invalide"})
  } 

  if (req.header.dataToken.data.id != req.params.id ){
    return res.status(403).send({message : "route non autorisée"})
  }
  Selectionneur.delete(req,res)
}

exports.findAll = (req,res) =>{
  if (req.tokenData == null){
    return res.status(401).send({message : "token invalide"})
  }
  if (req.tokenData.type != "Organisateur"){
    return res.status(403).send({message : "route non autorisée"})
  }
  Selectionneur.findAll(req,res)
}
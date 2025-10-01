const Joueur = require("../class/joueur.class.js");

exports.create = (req, res) => {
  if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Veuillez remplir tous les champs !"
    });
  }

  const joueur = new Joueur({
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    password: req.body.password
  });

  joueur.create(res, "Joueurs");
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
  Joueur.delete(req,res)
};

exports.findAll = (req,res) =>{
  if (req.tokenData == null){
    return res.status(401).send({message : "token invalide"})
  }
  if (req.tokenData.type == "Joueurs"){
    return res.status(403).send({message : "route non autorisée"})
  }
  Joueur.findAll(req,res)
}

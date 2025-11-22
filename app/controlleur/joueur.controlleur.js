const Joueur = require("../class/joueur.class.js");

// exports.create = (req, res) => {
//   if (req.tokenData == null && req.tokenData.type != "Admin"){
//     return res.status(401).send({message : "token invalide"})
//   }

//   if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.password) {
//     return res.status(400).send({
//       message: "Veuillez remplir tous les champs !"
//     });
//   }

//   const joueur = new Joueur({
//     prenom: req.body.prenom,
//     nom: req.body.nom,
//     email: req.body.email,
//     password: req.body.password
//   });

//   joueur.create(res, "Joueurs");
// };

exports.findAll = (req,res) =>{
  if (req.tokenData == null){
    return res.status(401).send({message : "token invalide"})
  }
  Joueur.findAll(req,res)
}

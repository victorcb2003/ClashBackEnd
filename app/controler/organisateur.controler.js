const Organisateur = require("../class/organisateur.class.js");

// exports.create = (req, res) => {
//   if (!req.body.prenom || !req.body.nom || !req.body.email || !req.body.password) {
//     res.status(400).send({
//       message: "Veuillez remplir tous les champs !"
//     });
//     return;
//   }

//   const organisateur = new Organisateur({
//     prenom: req.body.prenom,
//     nom: req.body.nom,
//     email: req.body.email,
//     password: req.body.password
//   });

//   organisateur.create(res,"Organisateurs");
// };

exports.findAll = (req,res) =>{
  if (req.tokenData == null){
    return res.status(401).send({message : "token invalide"})
  }
  Organisateur.findAll(req,res)
}
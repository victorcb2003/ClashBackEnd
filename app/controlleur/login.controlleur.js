const User = require("../class/user.class.js");
const Token = require("../class/token.class.js")

exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "body.email ou body.password est vide"
    });
    return;
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.login(res);
};

exports.delete = (req,res) =>{
  if (!req.params.id){
    return res.status(401).send({message : "params.id est vide"})
  }

  if (req.tokenData == null && typeof(req.tokenData.id) == 'number'){
    return res.status(401).send({message : "token invalide"})
  } 

  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin"){
    return res.status(403).send({message : "route non autorisée"})
  }
  User.delete(req,res)
};

exports.test = (req, res) => {
  console.log(req.headers,req.cookie);
    if (!req.tokenData) {
        res.status(401).send({ message: "Token invalide" });
    } else {
        res.status(200).send({data: req.tokenData});
    }
};

exports.info = (req,res) =>{
  if (req.tokenData == null || typeof(req.tokenData.id) != 'number'){
    return res.status(401).send({message : "token invalide"})
  } 
  User.info(req,res)
};

exports.update = (req,res) =>{
  if (req.tokenData == null || typeof(req.tokenData.id) != 'number'){
    return res.status(401).send({message : "token invalide"})
  } 
  User.update(req,res)
};

exports.getVerif = (req,res)=>{
  if (req.tokenData == null){
    return res.status(400).send({message : "token invalide"})
  }
  if (req.tokenData.type != "Admin" && req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Organisateurs"){
    return res.status(400).send({message : "Vous n'avez pas accès a cette route"})
  }
  User.getVerif(req,res)
}

exports.putVerif = (req,res)=>{
  if (req.tokenData == null){
    return res.status(400).send({message : "token invalide"})
  }
  if (req.tokenData.type != "Admin" && req.tokenData.type != "Selectionneurs" && req.tokenData.type != "Organisateurs"){
    return res.status(400).send({message : "Vous n'avez pas accès a cette route"})
  }
  if (req.body.id == undefined || req.body.value == undefined){
    return res.send(400).send({message : "req.body.id ou/et req.body.value est/sont undefined"})
  }
  User.putVerif(req,res)
}

const User = require("../class/user.class.js");

exports.login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({message: "req.body.email est requis."});
  }
  if (!req.body.password) {
    return res.status(400).send({message: "req.body.password est requis."});
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.login(res);
};

exports.delete = (req,res) =>{
  if (!req.params.id){
    return res.status(400).send({message : "params.id est requis."})
  }

  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  } 
  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin"){
    return res.status(403).send({message : "Accès non autorisé."})
  }
  User.delete(req,res)
};

exports.logout = (req,res) =>{

  User.logout(req,res)
};

exports.test = (req, res) => {
    if (!req.tokenData) {
        res.status(401).send({ message: "Accès non autorisé." });
    } else {
        res.status(200).send({data: req.tokenData});
    }
};

exports.info = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  } 
  User.info(req,res)
};

exports.update = (req,res) =>{
  if (!req.tokenData){
    return res.status(401).send({message : "Accès non autorisé."})
  } 
  User.update(req,res)
};

exports.getVerif = (req,res)=>{
  if (!req.tokenData || ["Admin","Selectionneurs","Organisateurs"].include(req.tokenData.type)){
    return res.status(403).send({message : "Accès non autorisé."})
  }

  User.getVerif(req,res)
}

exports.putVerif = (req,res)=>{
  if (!req.tokenData || ["Admin","Selectionneurs","Organisateurs"].include(req.tokenData.type)){
    return res.status(403).send({message : "Accès non autorisé."})
  }
  if (!req.body.id){
    return res.send(400).send({message : "req.body.id est requis."})
  }
  if (!req.body.value){
    return res.send(400).send({message : "req.body.value est requis."})
  }

  User.putVerif(req,res)
}

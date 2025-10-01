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


exports.test = (req, res) => {
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
    console.log('aaa')
    return res.status(401).send({message : "token invalide"})
  } 
  User.update(req,res)
};

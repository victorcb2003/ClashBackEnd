const User = require("../class/user.class.js");

exports.login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ error: "req.body.email est requis." });
  }
  if (!req.body.password) {
    return res.status(400).send({ error: "req.body.password est requis." });
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.login(res);
};

exports.delete = (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ error: "params.id est requis." })
  }

  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." })
  }
  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." })
  }
  User.delete(req, res)
};

exports.logout = (req, res) => {

  User.logout(req, res)
};

exports.test = (req, res) => {
  if (!req.tokenData) {
    res.status(401).send({ error: "Accès non autorisé." });
  } else {
    res.status(200).send({ data: req.tokenData });
  }
};

exports.info = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." })
  }
  User.info(req, res)
};

exports.update = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." })
  }
  if (!req.params.id) {
    return res.status(400).send({ error: "params.id est requis." })
  }
  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." })
  }
  if (!req.body.nom && !req.body.prenom ) {
    return res.status(400).send({ error: "Au moins un des champs suivants doit être fourni: nom, prenom." })
  }
  User.update(req, res)
};

exports.changePassword = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." })
  }
  if (!req.params.id) {
    return res.status(400).send({ error: "params.id est requis." })
  }
  if (req.tokenData.id != req.params.id) {
    return res.status(403).send({ error: "Accès non autorisé." })
  }
  if (!req.body.currentPassword) {
    return res.status(400).send({ error: "req.body.currentPassword est requis." })
  }
  if (!req.body.newPassword) {
    return res.status(400).send({ error: "req.body.newPassword est requis." })
  }

  User.changePassword(req, res)
};

exports.getVerif = (req, res) => {
  if (!req.tokenData || req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." })
  }

  User.getVerif(req, res)
}

exports.putVerif = (req, res) => {
  if (!req.tokenData || req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." })
  }
  if (!req.body.id) {
    return res.send(400).send({ error: "req.body.id est requis." })
  }
  if (!req.body.value) {
    return res.send(400).send({ error: "req.body.value est requis." })
  }

  User.putVerif(req, res)
}

exports.search = (req,res) =>{
  if (!req.tokenData){
    return res.status(403).send({ error: "Accès non autorisé." })
  }
  if (!req.params.input){
    return res.status(400).send({ error: "req.params.input est requis." })
  }

  User.search(req,res)
}

exports.uploadImage = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." });
  }
  if (!req.file) {
    return res.status(400).send({ error: "req.file est requis." });
  }
  if (!req.params.id) {
    return res.status(400).send({ error: "req.params.id est requis." });
  }
  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." });
  }

  User.uploadImage(req, res);
};

exports.deleteImage = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error: "Accès non autorisé." });
  }
  if (!req.params.id) {
    return res.status(400).send({ error: "req.params.id est requis." });
  }
  if (req.tokenData.id != req.params.id && req.tokenData.type != "Admin") {
    return res.status(403).send({ error: "Accès non autorisé." });
  }

  User.deleteImage(req, res);
};


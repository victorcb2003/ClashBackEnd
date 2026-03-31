const Selectionneur = require("../class/selectionneur.class.js");

exports.findAll = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  Selectionneur.findAll(req, res)
}

exports.accept = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  if (!req.body.Equipe_id || !req.body.User_id) {
    return res.status(400).send({ error : "req.body.Equipe_id et req.body.User_id sont requis." })
  }
  Selectionneur.acceptJoueur(req, res)
}

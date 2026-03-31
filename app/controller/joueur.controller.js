const Joueur = require("../class/joueur.class.js");

exports.findAll = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  Joueur.findAll(req, res)
}

exports.info = (req, res) => {
  if (!req.tokenData) {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  if (!req.params.id) {
    return res.status(400).send({ error : "req.params.id est requis." })
  }
  Joueur.info(req, res)
}

exports.setPendingEquipe = (req, res) => {
  if (!req.tokenData && req.tokenData.type != "Joueurs") {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  if (!req.body.Equipe_id) {
    return res.status(400).send({ error : "req.body.Equipe_id est requis." })
  }
  Joueur.setPendingEquipe(req, res)
}

exports.deletePendingEquipe = (req, res) => {
  if (!req.tokenData && req.tokenData.type != "Joueurs") {
    return res.status(401).send({ error : "Accès non autorisé." })
  }
  Joueur.deletePendingEquipe(req, res)
}
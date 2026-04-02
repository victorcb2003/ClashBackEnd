const express = require("express");

module.exports = app => {
    const joueur = require("../controller/joueur.controller.js");


    let router = express.Router();

    router.get("/findAll", joueur.findAll);

    router.post("/setPendingEquipe", joueur.setPendingEquipe);
    
    router.delete("/deletePendingEquipe", joueur.deletePendingEquipe);

    router.delete('/quitEquipe', joueur.quitEquipe);

    app.use('/api/joueur', router);
};
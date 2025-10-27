const express = require("express");

module.exports = app => {
    const joueur = require("../controlleur/joueur.controlleur.js");


    let router = express.Router();

    router.post("/create", joueur.create);

    router.get("/findAll", joueur.findAll);

    app.use('/api/joueur', router);
};
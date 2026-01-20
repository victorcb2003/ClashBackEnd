const express = require("express");

module.exports = app => {
    const joueur = require("../controler/joueur.controler.js");


    let router = express.Router();

    router.get("/findAll", joueur.findAll);

    app.use('/api/joueur', router);
};
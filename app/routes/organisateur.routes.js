const express = require("express");

module.exports = app => {
    const organisateur = require("../controler/organisateur.controlleur.js");

    let router = express.Router();

    router.get("/findAll", organisateur.findAll);

    app.use('/api/organisateur', router);
};
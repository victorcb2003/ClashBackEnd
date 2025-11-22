const express = require("express");

module.exports = app => {
    const organisateur = require("../controlleur/organisateur.controlleur.js");

    let router = express.Router();

    router.get("/findAll", organisateur.findAll);

    app.use('/api/organisateur', router);
};
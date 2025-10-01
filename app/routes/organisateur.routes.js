const express = require("express");

module.exports = app => {
    const organisateur = require("../controlleur/organisateur.controlleur.js");

    let router = express.Router();

    router.post("/create", organisateur.create);

    router.get("/findAll", organisateur.findAll);

    router.delete("/delete/:id", organisateur.delete);

    app.use('/api/organisateur', router);
};
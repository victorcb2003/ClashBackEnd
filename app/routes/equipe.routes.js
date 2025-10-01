const express = require("express");

module.exports = app => {
    const equipe = require("../controlleur/equipe.controlleur.js");


    let router = express.Router();

    // router.post("/update/:id", equipe.create);

    // router.post("/create", equipe.create);

    // router.get("/findAll", equipe.findAll);

    // router.delete("/delete/:id", equipe.delete);

    app.use('/api/equipe', router);
};
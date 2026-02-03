const express = require("express");

module.exports = app => {
    const equipe = require("../controller/equipe.controller.js");


    let router = express.Router();

    router.post("/addJoueur", equipe.addJoueur);

    router.delete("/removeJoueur", equipe.removeJoueur);

    router.put("/rename", equipe.rename);

    router.post("/create", equipe.create);

    router.get("/:id", equipe.info);

    router.get("/findAll", equipe.findAll);

    router.delete("/delete", equipe.delete);

    app.use('/api/equipe', router);
};
const express = require("express");

module.exports = app => {
    const groupe = require("../controlleur/groupe.controlleur.js");


    let router = express.Router();

    router.post("/add", groupe.addJoueur);

    router.delete("/remove", groupe.removeJoueur);

    router.put("/rename", groupe.rename);

    router.post("/create", groupe.create);

    router.get("/info/:id", groupe.info);

    router.get("/findAll", groupe.findAll);

    router.delete("/delete", groupe.delete);

    app.use('/api/groupe', router);
};
const express = require("express");

module.exports = app => {
    const tournois = require("../controler/tournois.controler.js");


    let router = express.Router();

    router.post("/create", tournois.create);

    router.put("/update", tournois.update);

    router.get("/findAll", tournois.findAll);

    router.delete("/delete/:id", tournois.delete);

    router.post("/addEquipe", tournois.addEquipe);

    router.delete("/removeEquipe", tournois.removeEquipe);

    router.post("/start", tournois.start);

    router.get("/:id", tournois.info);

    app.use('/api/tournois', router);
};
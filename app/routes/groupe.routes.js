const express = require("express");

module.exports = app => {
    const groupe = require("../controler/groupe.controlleur.js");


    let router = express.Router();

    router.post("/add", groupe.add);

    router.delete("/remove", groupe.remove);

    router.put("/rename", groupe.rename);

    router.post("/create", groupe.create);

    router.get("/info/:id", groupe.info);

    // router.get("/findAll", groupe.findAll);

    router.delete("/delete/:id", groupe.delete);

    router.delete("/messageDelete/:id", groupe.messageDelete);

    router.post("/messageCreate", groupe.messageCreate);

    router.get("/messageFindAll/:id", groupe.messageFindAll);

    router.put("/messageUpdate", groupe.messageUpdate);

    app.use('/api/groupe', router);
};
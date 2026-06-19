const express = require("express");

module.exports = app => {
    const sel = require("../controller/selec.controller.js");

    let router = express.Router();

    router.post("/addJoueur", sel.addJoueur);
    router.delete("/removeJoueur", sel.removeJoueur);
    router.get("/:match_id", sel.findByMatch);

    app.use('/api/selec', router);
};
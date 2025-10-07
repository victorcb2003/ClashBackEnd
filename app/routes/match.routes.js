const express = require("express");

module.exports = app => {
    const match = require("../controlleur/match.controlleur.js");


    let router = express.Router();

    router.put("/update", match.update);

    router.get("/findAll/:id", match.findAll);

    app.use('/api/match', router);
};
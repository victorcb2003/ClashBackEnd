const express = require("express");

module.exports = app => {
    const match = require("../controler/match.controler.js");


    let router = express.Router();

    router.put("/update", match.update);

    router.get("/findByTournoisId/:id", match.findAll);

    app.use('/api/match', router);
};
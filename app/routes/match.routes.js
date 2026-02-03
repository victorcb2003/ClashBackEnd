const express = require("express");

module.exports = app => {
    const match = require("../controller/match.controller.js");


    let router = express.Router();

    router.put("/update", match.update);

    router.post("/create", match.create)

    router.get("/findByTournoisId/:id", match.findAll);

    router.get("/:id", match.getById)

    app.use('/api/match', router);
};
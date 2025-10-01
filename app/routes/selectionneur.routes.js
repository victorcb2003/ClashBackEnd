const express = require("express");

module.exports = app => {
    const selectionneur = require("../controlleur/selectionneur.controlleur.js");

    let router = express.Router();

    router.post("/create", selectionneur.create);

    router.get("/findAll", selectionneur.findAll);

    router.delete("/delete/:id", selectionneur.delete);

    app.use('/api/selectionneur', router);
};
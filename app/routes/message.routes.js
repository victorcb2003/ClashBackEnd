const express = require("express");

module.exports = app => {
    const message = require("../controlleur/message.controlleur.js");


    let router = express.Router();

    router.post("/create", message.create);

    router.get("/findAll", message.findAll);

    router.delete("/delete/:id", message.delete);

    app.use('/api/message', router);
};
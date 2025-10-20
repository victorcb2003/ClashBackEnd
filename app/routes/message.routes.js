const express = require("express");

module.exports = app => {
    const message = require("../controlleur/message.controlleur.js");


    let router = express.Router();

    router.post("/create", message.create);

    router.put("/update", message.update);

    router.delete("/delete/:id", message.delete);

    router.get("/findAll", message.findAll);

    app.use('/api/message', router);
};
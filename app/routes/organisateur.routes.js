const express = require("express");

module.exports = app => {
    const organisateur = require("../controller/organisateur.controller.js");

    let router = express.Router();

    router.get("/findAll", organisateur.findAll);

    app.use('/api/organisateur', router);
};
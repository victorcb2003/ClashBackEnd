const express = require("express");

module.exports = app => {
    const paiement = require("../controller/paiement.controller.js");

    let router = express.Router();

    router.get("/modes", paiement.modes);

    router.post("/create", paiement.create);

    app.use('/api/paiement', router);
};
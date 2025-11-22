const express = require("express");

module.exports = app => {
    const form = require("../controlleur/form.controlleur.js");


    let router = express.Router();

    router.post("/", form.post);

    router.get("/", form.get)

    router.put("/verifEmail", form.verifEmail)

    app.use('/api/form', router);
};
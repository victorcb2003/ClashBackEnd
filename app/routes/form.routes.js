const express = require("express");

module.exports = app => {
    const form = require("../controler/form.controler.js");


    let router = express.Router();

    router.post("/", form.post);

    router.get("/", form.get)

    router.post("/confirm", form.confirm);

    app.use('/api/form', router);
};
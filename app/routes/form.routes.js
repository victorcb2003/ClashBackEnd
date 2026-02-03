const express = require("express");

module.exports = app => {
    const form = require("../controller/form.controller.js");


    let router = express.Router();

    router.post("/", form.post);

    router.get("/", form.get)

    router.post("/confirm", form.confirm);

    app.use('/api/form', router);
};
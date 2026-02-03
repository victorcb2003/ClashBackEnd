const express = require("express");

module.exports = app => {
    const but = require("../controller/but.controller.js");


    let router = express.Router();

    router.put("/update", but.update);

    router.post("/create", but.create);

    router.get("/:id", but.info);

    router.get("/findAllByMatch/:id", but.findAll);

    router.delete("/delete/:id", but.delete);

    app.use('/api/but', router);
};
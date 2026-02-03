const express = require("express");

module.exports = app => {
    const selectionneur = require("../controller/selectionneur.controller.js");

    let router = express.Router();

    router.get("/findAll", selectionneur.findAll);

    app.use('/api/selectionneur', router);
};
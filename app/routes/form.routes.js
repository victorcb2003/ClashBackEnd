const express = require("express");

module.exports = app => {
    const form = require("../controller/form.controller.js");


    let router = express.Router();

    router.post("/", form.post);

    router.post("/confirm", form.confirm);

    router.post("/reset-password", form.resetPassword);

    router.post("/confirm-reset-password", form.confirmResetPassword);

    app.use('/api/form', router);
};
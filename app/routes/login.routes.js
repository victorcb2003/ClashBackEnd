const express = require("express");

module.exports = app => {
    const user = require("../controlleur/login.controlleur.js");

    let router = express.Router();

    router.post("/login", user.login);

    router.get("/info", user.info);

    router.put("/update/", user.update);

    router.delete("/delete/:id", user.delete);

    router.get("/verif", user.getVerif);

    router.put("/verif", user.putVerif);

    app.use('/api/user', router);
};
const express = require("express");

module.exports = app => {
    const user = require("../controller/login.controller.js");

    let router = express.Router();

    router.post("/login", user.login);

    router.get("/logout", user.logout)

    router.get("/me", user.info);

    router.put("/update/", user.update);

    router.delete("/delete/:id", user.delete);

    router.get("/verif", user.getVerif);

    router.put("/verif", user.putVerif);

    router.get("/:id", user.info);

    app.use('/api/user', router);
};
const express = require("express");
const multer = require("multer");

module.exports = app => {
    const user = require("../controller/user.controller.js");
    const upload = multer({ storage: multer.memoryStorage() });

    let router = express.Router();

    router.post("/login", user.login);

    router.get("/logout", user.logout)

    router.get("/me", user.info);

    router.put("/update/:id", user.update);

    router.post("/image/:id", upload.single("image"), user.uploadImage);

    router.delete("/image/:id", user.deleteImage);

    router.delete("/delete/:id", user.delete);

    router.get("/verif", user.getVerif);

    router.put("/verif", user.putVerif);

    router.get("/search/:input", user.search)

    router.get("/:id", user.info);

    app.use('/api/user', router);
};
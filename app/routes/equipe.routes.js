const express = require("express");
const multer = require("multer");

module.exports = app => {
    const equipe = require("../controller/equipe.controller.js");

    const upload = multer({ storage: multer.memoryStorage() });


    let router = express.Router();

    router.post("/addJoueur", equipe.addJoueur);

    router.delete("/removeJoueur", equipe.removeJoueur);

    router.put("/rename", equipe.rename);

    router.post("/create", equipe.create);

    router.get("/findAll", equipe.findAll);

    router.delete("/delete", equipe.delete);

    router.get("/me", equipe.me);

    router.post("/image/:id", upload.single("image"), equipe.uploadImage);

    router.delete("/image/:id", equipe.deleteImage);

    router.get("/:id", equipe.info);

    app.use('/api/equipe', router);
};
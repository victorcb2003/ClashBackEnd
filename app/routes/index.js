module.exports = app => {

    // middleware

    require("./joueur.routes.js")(app);
    require("./user.routes.js")(app);
    require("./selectionneur.routes.js")(app);
    require("./organisateur.routes.js")(app);
    require("./equipe.routes.js")(app);
    require("./tournois.routes.js")(app);
    require("./match.routes.js")(app);
    require("./form.routes.js")(app)
    require("./but.routes.js")(app)
    require("./selectionné.js")(app)
    // j'atoue ma route 
    require("./paiement.routes.js")(app)

    app.use((req, res) => {
        res.status(404).json({ message: "Route non trouvée "+req.path });
    });
}
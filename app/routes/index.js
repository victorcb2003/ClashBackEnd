const Token = require("../class/token.class.js")

module.exports = app => {

    // middleware

    require("./joueur.routes.js")(app);
    require("./login.routes.js")(app);
    require("./selectionneur.routes.js")(app);
    require("./organisateur.routes.js")(app);
    require("./equipe.routes.js")(app);
    require("./tournois.routes.js")(app);
    require("./match.routes.js")(app);
    require("./message.routes.js")(app);
    require("./groupe.routes.js")(app)
    require("./form.routes.js")(app)

    app.use((req, res) => {
        res.status(404).json({ message: "Route non trouvée "+req.path });
    });
}
const Token = require("../class/token.class.js")

module.exports = app => {

    // middleware
    app.use((req, res, next) => {
        if (!req.headers.token) {
            req.Token = null;
            return next();
        }

        const result = Token.verifyToken(req.headers.token, res);
        if (result != false) {
            req.tokenData = result;
            next();
        }
    });

    require("./joueur.routes.js")(app);
    require("./login.routes.js")(app);
    require("./selectionneur.routes.js")(app);
    require("./organisateur.routes.js")(app);
    require("./equipe.routes.js")(app);
    require("./tournois.routes.js")(app);
    require("./match.routes.js")(app);
    require("./message.routes.js")(app);
    require("./groupe.routes.js")(app)
    require("./groupe.routes.js")(app)

    app.use((req, res) => {
        res.status(404).json({ message: "Route non trouvée "+req.path });
    });
}
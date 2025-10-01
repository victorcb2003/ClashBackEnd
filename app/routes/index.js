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
    // require("../app/routes/equipe.routes.js")(app);
    // require("../app/routes/tournoi.routes.js")(app);
    // require("../app/routes/match.routes.js")(app);
    // require("../app/routes/message.routes.js")(app);
    // require("../app/routes/groupe.routes.js")(app);

    app.use((req, res) => {
        res.status(404).json({ message: "Route non trouvée" });
    });
}
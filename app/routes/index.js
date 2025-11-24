const Token = require("../class/token.class.js")

module.exports = app => {

    // middleware
    app.use((req, res, next) => {
        if (!req.headers.cookie) {
            req.tokenData = null;
            return next();
        }
        const str = req.headers.cookie
        const match = str.match(/token=([A-Za-z0-9._-]+)/);
        if (!match) {
            req.tokenData = null;
            return next();
        }
        console.log("Token trouvé dans les cookies :", match[1]);
        const result = Token.verifyToken(match[1],res);
        if (result != false) {
            req.tokenData = result;
        } 
        next();
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
    require("./form.routes.js")(app)

    app.use((req, res) => {
        res.status(404).json({ message: "Route non trouvée "+req.path });
    });
}
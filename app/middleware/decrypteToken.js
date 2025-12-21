const Token = require("../class/token.class.js")

module.exports = app => {

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
        const result = Token.verifyToken(match[1], req);
        if (result != false) {
            req.tokenData = result;
        } else {
            req.tokenData = null;
        }
        next();
    });
}
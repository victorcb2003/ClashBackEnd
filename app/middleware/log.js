module.exports = app => {

    app.use((req, res, next) => {

        const start = Date.now();

        res.on("finish", () => {
            
            const couleur = req.method[0] == "4" ? "\x1b[31m" : "\x1b[32m"

            console.log(`${couleur} [FINISH] ${req.method} \x1b[37m ${req.url} -> ${res.statusCode} (${Date.now() - start}ms)`)
        })

        next()
    });
}
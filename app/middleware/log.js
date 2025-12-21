module.exports = app => {

    app.use((req, res, next) => {

        const start = Date.now();

        res.on("finish", () => {
            
            const couleur = req.method[0] == "4" ? "\e[31m" : "\e[32m"

            console.log(`${couleur} [FINISH] ${req.method} \e[37m ${req.url} -> ${res.statusCode} (${Date.now() - start}ms)`)
        })

        next()
    });
}
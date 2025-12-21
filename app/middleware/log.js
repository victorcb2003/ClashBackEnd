module.exports = app => {

    app.use((req, res, next) => {

        const start = Date.now();

        res.on("finish", () => {

            const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
            
            const couleur = parseInt(res.statusCode/100) == 4 || parseInt(res.statusCode/100) == 5 ? "\x1b[31m" :  "\x1b[32m"

            const user = req.tokenData && req.tokenData.id ? `UserID : ${req.tokenData.id}` : ""

            console.log(` [FINISH] ${req.method} ${req.url} -> ${couleur} ${res.statusCode} \x1b[37m  (${Date.now() - start}ms) | UserIP : ${ip} ${user}`)
        })

        next()
    });
}
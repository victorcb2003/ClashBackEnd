const dbconnection = require('../db/connection');

module.exports = class match {

    static base(req,res) {
        const equipes = req.equipes
        const tours = Math.ceil(Math.sqrt(equipes.length))

        let arbre = []

        for (let y = 0; y < 2 ** tours; y++) {
            arbre.push(null)
        }
        let index = 0
        while (equipes.length != 0) {
            const rdm = Math.floor(Math.random() * equipes.length)
            arbre[index] = equipes[rdm]
            equipes.splice(rdm, 1)
            index += 1
        }

        let sql = ""
        let value = []
        let h = 0

        for (let i = 0;i< equipes.length;i++){
            sql+="inser into Matchs date_heure,lieu,tour values (?,?,?);"
            value.push(10+h)
            h+=3
            value.push(req.lieu)
            value.push(Math.ceil(Math.sqrt(equipes.length)))
        }

    }
}
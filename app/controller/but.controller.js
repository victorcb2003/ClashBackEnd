const But = require("../class/but.class.js")

exports.create = (req, res) => {
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type != "Admin"){
        return res.status(403).send({message : "Accès non autorisé."})
    }
    if (!req.body.date_heure){
        return res.status(400).send({message : "req.body.date_heure est requis."})
    }
    if (!req.body.User_id){
        return res.status(400).send({message : "req.body.User_id est requis."})
    }
    if (!req.body.Match_id){
        return res.status(400).send({message : "req.body.Match_id est requis."})
    }
    if (!req.body.Type_But){
        return res.status(400).send({message : "req.body.Type_But est requis."})
    }
    // const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    // if (!regex.test(req.body.date_heure)) {
    //     return res.status(400).send({ message: "La date doit être au format 'YYYY-MM-DD HH:mm:SS'."  })
    // }
    if (parseInt(req.body.Match_id) != req.body.Match_id){
        return res.status(400).send({message : "req.body.Match_id est pas un entier"})
    }
    console.log(req.body.Type_But)
    if ([0,1].includes(req.body.Type_But)){
        return res.status(400).send({message : "req.body.Type_But doit être soit 1 ou 0"})
    }
    console.log(req.body.User_id)
    if (parseInt(req.body.User_id) != req.body.User_id){
        return res.status(400).send({message : "req.body.User_id est pas un entier"})
    }

    But.create(req,res)
};

exports.info = (req,res)=>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({message : "req.params est requis."})
    }
    if (typeof(req.params.id) != "number" || parseInt(req.params.id) != req.params.id){
        return res.status(400).send({message : "req.params.id est pas un entier"})
    }

    But.info(req,res)
}

exports.findAll = (req, res)=>{
    if (!req.tokenData){
        return res.status(401).send({message : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({message : "req.params est requis."})
    }
    if ( parseInt(req.params.id) != req.params.id){
        return res.status(400).send({message : "req.params.id est pas un entier"})
    }

    But.findAll(req, res)
}

exports.delete = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type !="Admin"){
        return res.status(403).send({message : "Accès non autorisé."})
    }
    if (!req.params.id){
        return res.status(400).send({message : "req.body.But_id est requis."})
    }
    if (typeof(req.params.id) != "number" || parseInt(req.params.id) != req.params.id){
        return res.status(400).send({message : "req.body.But_id est pas un entier"})
    }

    But.delete(req,res)
}

exports.update = (req,res) =>{
    if (!req.tokenData || req.tokenData.type != "Organisateurs" && req.tokenData.type !="Admin"){
        return res.status(403).send({message : "Accès non autorisé."})
    }
    if (!req.body.But_id){
        return res.status(400).send({message : "req.body.But_id est requis."})
    }
    if (typeof(req.body.But_id) != "number" || parseInt(req.body.But_id) != req.body.But_id){
        return res.status(400).send({message : "req.body.But_id est pas un entier"})
    }
    if (!req.body.date_heure && !req.body.User_id && !req.body.Match_id && !req.body.Type_But){
        return res.status(400).send({ message: "il faut au moins remplir req.body.date_heure ou req.body.User_id ou req.body.Match_id ou req.body.Type_But"  })
    }
    if (req.body.date_heure && !regex.test(req.body.date_heure)) {
        return res.status(400).send({ message: "req.body.date est pas au format 'YYYY-MM-DD HH:mm:SS'"  })
    }
    if (req.body.Match_id && (typeof(req.body.Match_id) != "number" || parseInt(req.body.Match_id) != req.body.Match_id)){
        return res.status(400).send({message : "req.body.Match_id est pas un entier"})
    }vide
    if (req.body.Type_But && (typeof(req.body.Type_But) != "number" || [0,1].includes(req.body.Type_But))){
        return res.status(400).send({message : "req.body.Type_But doit être soit 1 ou 0"})
    }
    if (req.body.User_id && (typeof(req.body.User_id) != "number" || parseInt(req.body.User_id) != req.body.User_id)){
        return res.status(400).send({message : "req.body.User_id est pas un entier"})
    }
    
    But.update(req,res)
}
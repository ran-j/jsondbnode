var DB = require("../src/index");
const Escolas = DB.model // example model
const DBCONFIG = DB.manager

function saveAndEdit() {
    new Escolas({
        nome: "RanNet",
        creat: new Date()
    }).save().then((newEscola) => {
        //sort by field
        // Escolas.sort("creat") //default null
        //limit response
        // Escolas.limit(2) //default 100
        //do not parse to jsonDBObject
        // Escolas.lean(false) //default false
        //find by query
        Escolas.find({ nome: "RanNet" }, { sort : 'creat', limit: 2 }).exec((err, data) => { // after a query the option above are reset to default
            if (err) return console.log(err)
            console.log(data)
            //if lean is set to true you cant do the follow
            data[0].nome = "NovaRanNetTeste"
            data[0].save().then(console.log).catch(console.error)
        })
    }).catch(console.error)
}

function createMultiple() {
    console.log("creating")
    for (var i = 0; i < 10; i++) {
        new Escolas({
            nome: "RanNet" + i,
            creat: new Date()
        }).save().then((a) => {
            setTimeout(() => {
                a.nome = "NovaRanNet"
                a.save().then(console.log).catch(console.error)
            }, 1000 * i)
        }).catch(console.error)
    }
}

DBCONFIG.configDB({ dbPath: "./db.json" }) // set DB.json path
DBCONFIG.resetDB().then(() => { // delete all data from DB.json
    saveAndEdit(); // example create find and edit
    createMultiple() // create and edit in array
}).catch(console.error)

const config = require("../utils")
const Queue = require("../queue")
const fs = require("fs")

const resetDB = () => new Promise((resolve, reject) => {
    Queue.clearQueue()
    setTimeout(() => {
        fs.writeFile(config.dbPath, '[]', (err, data) => {
            if (err) return reject(err)
            resolve("done")
        })
    }, 500)
})

const configDB = ({ dbPath }) => {
    config.dbPath = dbPath
    fs.access(dbPath, fs.F_OK, (err) => {
        if (err) {
            fs.writeFile(config.dbPath, '[]', (err, data) => {
                if (err) return reject(err)
                resolve("done")
            })
            return
        }
        //file exists
    })
}

module.exports = {
    resetDB,
    configDB
}
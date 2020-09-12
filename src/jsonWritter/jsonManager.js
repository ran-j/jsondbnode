const fs = require("fs")
const { resolve } = require("path")

var dbPath = ''

const writeData = (body, schemaName) => {
    readData().then((originalData) => {
        if(originalData) {
            originalData[schemaName] = configSchema(originalData, schemaName)
            originalData[schemaName].push(body)                        
            fs.writeFile(dbPath, JSON.stringify(originalData), (err, data) => {
                if (err) return console.log(err)
            })
        }
    })
}

const updateData = (body) => {

}

const deleteData = (body) => {

}

const configSchema = (originalData, schemaName) => {
    if(!originalData[schemaName]) {
        originalData[schemaName] = []
    } else {
        if(!Array.isArray(originalData[schemaName])) {
            originalData[schemaName] = []
        }
    }
    return originalData[schemaName]
}

const readData = () => new Promise((resolve, reject) => {
    fs.access(dbPath, fs.F_OK, (err) => {
        if (!err) {
            fs.readFile(config.dbPath, (error, data) => {
                if(error) {
                    try {
                        resolve(JSON.parse(data))
                    } catch (er) {
                        console.warn(`Error: ${er.message}`)
                        resolve(null)
                    }
                } else {
                    console.warn(`Error: ${error.message}`)
                    resolve(null)
                }
            })
        } else {
            console.warn(`Error: ${err.message}`)
            resolve(null)
        }
    })
})

module.exports = {
    writeData,
    readData,
    updateData,
    deleteData
}
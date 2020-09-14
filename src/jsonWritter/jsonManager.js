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
    }).catch(console.error)
}

const updateData = (id, body, schemaName) => {
    readData().then((originalData) => {
        if(originalData) {
            if(originalData[schemaName] && Array.isArray(originalData[schemaName])) {
                originalData[schemaName].forEach((row, index) => {
                    if(row._id === id) {
                        Object.keys(body).forEach((bodyKey) => {
                            originalData[schemaName][index][bodyKey] = row[bodyKey] 
                        })
                    }
                })
                fs.writeFile(dbPath, JSON.stringify(originalData), (err, data) => {
                    if (err) return console.log(err)
                })
            } else {
                console.error('schemaName not found')
            }
        }
    }).catch(console.error)
}

const deleteData = (id, schemaName) => {
    readData().then((originalData) => {
        if(originalData) {
            if(originalData[schemaName] && Array.isArray(originalData[schemaName])) {
                const index = originalData[schemaName].findIndex((row) => row._id === id)
                if(index > -1) {
                    originalData[schemaName].slice(0 , index)
                    fs.writeFile(dbPath, JSON.stringify(originalData), (err, data) => {
                        if (err) return console.log(err)
                    })
                }
            } else {
                console.error('schemaName not found')
            }
        }
    }).catch(console.error)
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
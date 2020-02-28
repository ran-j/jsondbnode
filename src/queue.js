var fs = require('fs')
const config = require("./utils");

var queueList = []
var updatequeueList = []

const INSERT_TIMEOUT = 100;

setInterval(() => {
    try {
        var current = queueList.shift();
        if (current) {
            fs.readFile(config.dbPath, (err, data) => {
                if (err) return console.log(err)
                var DBDATA = JSON.parse(data)
                var CURRENTDATA = JSON.parse(current)
                DBDATA.push(CURRENTDATA)
                fs.writeFile(config.dbPath, JSON.stringify(DBDATA), (err, data) => {
                    if (err) return console.log(err)
                    UpdateData()
                })
            })
        } else {
            UpdateData()
        }
    } catch (error) {
        console.log(error)
    }
}, INSERT_TIMEOUT);

const UpdateData = () => {
    try {
        var current = updatequeueList.shift();
        if (current) {
            fs.readFile(config.dbPath, (err, data) => {
                if (err) return console.log(err)
                var DBDATA = JSON.parse(data)
                var CURRENTDATA = JSON.parse(current.string)
                for (var i = 0, iMax = DBDATA.length; i < iMax; i++) {
                    if (DBDATA[i]._id == CURRENTDATA['_id']) {
                        DBDATA[i] = CURRENTDATA
                    }
                }
                fs.writeFile(config.dbPath, JSON.stringify(DBDATA), (err, data) => {
                    if (err) return console.log(err)
                })
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const addToQueue = (stringData) => {
    return queueList.push(stringData)
}

const addToQueueUpdate = (stringData, i) => {
    return updatequeueList.push({ string: stringData, i: i })
}

const clearQueue = () => {
    queueList = []
    updatequeueList = []
    return true
}

module.exports = {
    addToQueue,
    addToQueueUpdate,
    clearQueue
}
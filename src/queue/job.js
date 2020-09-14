const { writeData, readData, deleteData, updateData } = require('../jsonWritter/jsonManager')

const QueueList = [];
const queue_timeout = 1000;
var startOnlyOne = true
var altered = false

const appendData = async (body, type, schemaName) => { //'append' 'update' 'deleted'
    try {
        let validation = JSON.stringify(body);
        QueueList.push({
            type: type,
            data: body,
            parsed: validation,
            schemaName
        });
        altered = true
        ifNotStartedStart()
        //return object
        return true
    } catch (error) {
        throw new Error("Invalid payload");
    }
};

const syncData = () => {
    //populate readData
    readData().then((dataFromDB) => {
        if(dataFromDB) {
            QueueList = dataFromDB
        }
    }).catch(console.error)
}

const startJobs = () => {
    try {
        //block from call start again
        if(!startOnlyOne) return 'Job alreadyStarted'
        syncData()
        //start queue
        setInterval(() => {
            if(QueueList.length && altered) {
                var current = updatequeueList.shift()
                if (current) {
                    if(current.type === 'append') {
                        writeData(current.data, current.schemaName)
                    } else if (current.type === 'update') {
                        updateData(current.data._id, current.data, current.schemaName)
                    } else if (current.type === 'deleted') {
                        deleteData(current.data._id, current.schemaName)
                    }
                }
            }
        }, queue_timeout)
        //block startjob funcion
        startOnlyOne = false
    } catch (error) {
        console.error(error)
    }
}

const ifNotStartedStart = () => {
    if(startOnlyOne) {
        startJobs()
    }
}

module.exports = {
    syncData,
    appendData
}
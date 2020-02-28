var fs = require('fs')
const config = require("./utils");
const Queue = require("./queue");
const SAVE_TIMEOUT = 10;

class responseSchema {
    constructor(target) {
        this._props = Object.keys(target)
        this._target = target
        this._props.forEach(prop => {
            if (prop != "_id") if (prop != "__meta__") this[prop] = target[prop]
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    fs.readFile(config.dbPath, (err, data) => {
                        if (err) return reject(err)
                        var DBDATA = JSON.parse(data)
                        var output = {}
                        for (var i = 0, iMax = DBDATA.length; i < iMax; i++) {
                            if (DBDATA[i]._id == this._target['_id']) {
                                output = DBDATA[i]
                                this._props.forEach(prop => {
                                    if (prop != "_id") if (prop != "__meta__") output[prop] = config.IsDate(this[prop])
                                });
                                output["__meta__"].v += 1
                            }
                        }
                        if (!output) return resolve({})
                        Queue.addToQueueUpdate(JSON.stringify(output))
                        setTimeout(() => {
                            this._paralelol = true;
                            resolve(new responseSchema(config.reverseToDate(output)))
                        }, Queue.queueTimeout() + 200); //wait until queue timeout plus 200 ms to resolve  
                    })
                } catch (err) {
                    reject(err)
                }
            }, SAVE_TIMEOUT)
        })
    }
}

module.exports = responseSchema
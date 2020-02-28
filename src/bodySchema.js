var fs = require('fs')
const config = require("./utils");
const resposnseFile = require("./fileSchema");
const Queue = require("./queue");

const Pref = {
    defaultLimit: 100,
    defaultSort: false,
    defaultLean: false
}

class DbSchema {
    constructor(target) {
        this._props = Object.keys(target)
        this._target = target
        this._props.forEach(prop => {
            this[prop] = target[prop]
        });
        this._sort = Pref.defaultSort
        this._limit = Pref.defaultLimit
        this._lean = Pref.defaultLean
        this._isNew = true
    }

    static lean(doLean) {
        this._lean = doLean
    }

    static sort(_param) {
        this._sort = _param
    }

    static limit(_limit) {
        this._limit = _limit
    }

    static find(query) {
        return {
            exec: (cb) => {
                try {
                    fs.readFile(config.dbPath, (err, data) => {
                        if (err) return cb(err, []);
                        var DBDATA = JSON.parse(data)
                        var keys = Object.keys(query);
                        var output = [];
                        for (var i = 0, iMax = DBDATA.length; i < iMax; i++) {
                            for (var j = 0, jMax = keys.length; j < jMax; j++) {
                                if (DBDATA[i][keys[j]] == query[keys[j]]) {
                                    // var todate = new Date(DBDATA[i].date)
                                    // DBDATA[i].date = todate.getTime();
                                    output.push(this._lean ? config.reverseToDate(DBDATA[i]) : new resposnseFile(config.reverseToDate(DBDATA[i])))
                                }
                            }
                        }
                        if (output.length > this._limit) output.length = this._limit;
                        if (this._sort) output = output.sort((a, b) => a[this._sort] - b[this._sort]);
                        this._sort = Pref.defaultSort
                        this._limit = Pref.defaultLimit
                        this.lean = Pref.defaultLean
                        Array.isArray(output) ? cb(null, output) : cb(new Error("Erro on find item"), [])
                    })
                } catch (error) {
                    this._sort = Pref.defaultSort
                    this._limit = Pref.defaultLimit
                    this.lean = Pref.defaultLean
                    cb(error, []);
                }
            }
        }
    }

    save() {
        return new Promise((resolve, reject) => {
            try {
                if (!this._isNew) throw new Error("OBJECT not new")
                fs.readFile(config.dbPath, (err, data) => {
                    if (err) return reject(err)
                    var DBDATA = JSON.parse(data) // just to check if db exist and it can be parsed
                    var THISDATA = {
                        _id: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7),
                        __meta__: {
                            new: false,
                            v: 0
                        }
                    }
                    this._props.forEach(prop => {
                        THISDATA[prop] = config.IsDate(this._target[prop])
                    });
                    Queue.addToQueue(JSON.stringify(THISDATA))
                    setTimeout(() => {
                        this._isNew = false;
                        resolve(new resposnseFile(config.reverseToDate(THISDATA)))
                    }, 300);                    
                })
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = DbSchema

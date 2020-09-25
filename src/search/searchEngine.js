
const { Schema } = require('../shema/schema')
const { reverseToDate } = require('../utils')
const { getDataBySchema } = require('../jsonWritter/jsonManager')

const bowSearchOpitions = (input, defaultInput) => {
    if(!input) {
        return defaultInput;
    } else {
        Object.keys(defaultInput).forEach((key) => {
            if(!input[key]) {
                input[key] = defaultInput[key]
            }
        })
        return input
    }
}

class SearchEngine  {
    constructor(target, schemaName) {
        this._props = Object.keys(target)
        this._target = target
        this._props.forEach(prop => {
            this[prop] = target[prop]
        });
        this.searchOptions = {
            sort: false,
            limit: 500,
            lean: false
        }
        this.schemaName = schemaName
    }

    find(query, searchOP = {}) {
        return {
            exec: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        searchOP = bowSearchOpitions(searchOP, this.searchOptions)
                        const DBDATA = await getDataBySchema(this.schemaName)
                        var keys = Object.keys(query);
                        var output = [];
                        for (var i = 0, iMax = DBDATA.length; i < iMax; i++) {
                            for (var j = 0, jMax = keys.length; j < jMax; j++) {
                                if (DBDATA[i][keys[j]] === query[keys[j]]) {
                                    output.push(searchOP._lean ? reverseToDate(DBDATA[i]) : new Schema(reverseToDate(DBDATA[i]), this.schemaName))
                                }
                            }
                        }
                        if (output.length > searchOP._limit) output.length = searchOP._limit;
                        if (searchOP._sort) output = output.sort((a, b) => a[searchOP._sort] - b[searchOP._sort]);         
                        Array.isArray(output) ? resolve(output) : reject(new Error("Erro on find item"))
                    } catch (error) {
                        reject(error)
                    }
                    
                })

            }
        }
    }
}

module.exports = {
    SearchEngine
}
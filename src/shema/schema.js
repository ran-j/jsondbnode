
const  { appendData } = require('../queue/job')
const { SearchEngine } = require('../search/searchEngine')

class Schema extends SearchEngine{
    constructor(target, schemaName) {
        super(target, schemaName)
        this._props = Object.keys(target)
        this._target = target
        this.schemaName = schemaName
        this._props.forEach(prop => {
            if (prop != "_id") if (prop != "__meta__") this[prop] = target[prop]
        });
    }

    async save() {
        try {
            appendData(this._target, "append", this.schemaName)
            return true
        } catch (error) {
            throw error
        }
    }
}

module.exports = { 
    Schema
}
const { Schema } = require('./shema/schema')
const { setPath } = require('./constants')

const DBManager = (dbPath) => {
    setPath(dbPath)
}

module.exports = {
    Schema,
    DBManager
}
const dbPath = __dirname + "/data/db.json"

const IsDate = (date) => {
    try {
        let parse = new Date(date)
        return parse == "Invalid Date" ? date : parse.toISOString()
    } catch (error) {
        return date
    }
}

const ToDate = (date) => {
    try {
        let parse = new Date(date)
        return parse == "Invalid Date" ? date : parse
    } catch (error) {
        return date
    }
}

const reverseToDate = (target) => {
    try {
        var _props = Object.keys(target);
        var virtual = {}
        _props.forEach(prop => {
            virtual[prop] = ToDate(target[prop])
        });
        return virtual;
    } catch (error) {
        return target
    }
}

module.exports = {
    dbPath,
    IsDate,
    reverseToDate
}
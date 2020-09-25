var dbPath = './'

const setPath = (newPath) => {
    dbPath = newPath
}

const getPath = () => {
    return dbPath
}

module.exports= {
    setPath,
    getPath
}
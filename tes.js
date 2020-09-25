const { Schema, DBManager } = require('./src/index')

DBManager(__dirname+'/tes.json')

const Book = new Schema({ a:1 })

console.log(Book.find)

Book.save().then((a) => {
    console.log(a)
}).catch(console.error)
# Simple database made with JSON.

## Install

```sh
npm install jsondbnode
```

## Limitations
 * You may have problems with create and edit at the same time.
 * There is no backup, if the db.json get corrupted it's over

## Usage 
```js
var DB = require("../src/index");
const Books = DB.model // example model
const DBCONFIG = DB.manager

// set DB.json path
DBCONFIG.configDB({ dbPath: "./db.json" }) 

// delete all data from DB.json
DBCONFIG.resetDB().then(console.log).catch(console.error)

new Books({
    name: "The lord of the rings",
    create_at: new Date(1954, 6, 29)
}).save().then((newBook) => {
    console.log(newBook)
}).catch(console.error)
```

Se more at [Example](https://github.com/ran-j/jsondbnode/blob/master/example/index.js)
// Initiate MySQL database connection
// we need a test version of this as well as a production version

// This is the production version
// const mysql = require('mysql')
// const db = mysql.createConnection({
// host: "db5015882330.hosting-data.io",
// user: "dbu4255959",
// password: "-RWTCh01r-",
// database:"dbs12947000" 
// })



// This is the test version
const mysql = require('mysql')
const db = mysql.createConnection({
    host: localhost,
    user: "RWTUser",
    password: "RWTUser",
    database:"RWTChoir"
})
    module.exports = db;
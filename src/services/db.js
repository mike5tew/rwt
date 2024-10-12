// Used to connect to the database
// Import the required modules
// Create a connection pool
// Export the connection pool

// This is the test version
// The .env file should be in the root directory alng with the package.json file
import { createPool } from 'mysql';
import { promisify } from 'util';
//DB_HOST is not defined because it is not in the .env file
// dotenv has been installed and the .env file is in the root directory
// The .env file has been added to the .gitignore file
// the syntax for the .env file is:
// DB_HOST
const dotenv = require('dotenv').config()
if (dotenv.error) {
    console.error('Error in dotenv.config()::: ' + dotenv.error)
    process.exit(1)
}
console.log("dotenv.config()::: " + dotenv.parsed)
if (!process.env.DB_HOST) {
    console.error('DB_HOST is not defined::: ' + process.env.DB_HOST)
    process.exit(1)
} 
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env
const pool = createPool({
    connectionLimit: 10,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password : DB_PASS,
    database: DB_NAME
})
console.log("host:"+DB_HOST+" port:"+DB_PORT+" user:"+DB_USER+" password:"+DB_PASS+" database:"+DB_NAME)

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection was closed.')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connections.')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused.')
        }
    }
    if(connection) connection.release()
    return
}
)
pool.query = promisify(pool.query)
export default pool
// module.exports = db
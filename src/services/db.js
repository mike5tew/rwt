import { createPool } from 'mysql';
import util from 'util';
// const dotenv = require('dotenv').config();
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });



if (dotenv.error) {
  // console.error('Error in dotenv.config():', dotenv.error);
  window.alert('Error loading environment variables.' + dotenv.error);
  // Use window.alert or console.error to display an error message in the browser
  window.alert('Error loading environment variables.');
}

if (!process.env.DB_HOST) {
  console.error('DB_HOST is not defined:', process.env.DB_HOST);
  // Use window.alert or console.error to display an error message in the browser
  window.alert('DB_HOST environment variable is missing.');
}

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = dotenv.parsed;
const pool = createPool({
  connectionLimit: 10,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

console.log("host:", DB_HOST, "port:", DB_PORT, "user:", DB_USER, "password:", DB_PASS, "database:", DB_NAME);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    } else {
      console.error('Unknown database error:', err);
    }
  }

  if (connection) {
    connection.release();
  }
});

// If this is a front end application, is there an alternative to promisify?
pool.query = util.promisify(pool.query);
// pool.query = promisify(pool.query);

export default pool;
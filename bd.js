const mysql = require('mysql');
const util = require('util');
require('dotenv').config();


var pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
})

pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool ;

//Kizdarodino database hostings
const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB_HOST1, 
    user: process.env.DB_USERNAME1, 
    password: process.env.DB_PASSWORD1,
    database: process.env.DB_DBNAME1,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("Connected successfully")
})

module.exports = pool.promise()

//
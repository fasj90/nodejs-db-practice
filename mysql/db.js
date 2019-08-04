const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
let pool;

module.exports = {
    getPoolConnection
}

function getPoolConnection(){
    if(!pool){
        pool =  mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'db_posts',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    return pool;
}
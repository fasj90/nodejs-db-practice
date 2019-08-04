
let knex = require('knex');
let pool;

module.exports = {
    getPoolConnection
}

function getPoolConnection(){
    if(!pool){
        pool = knex ({
            client: 'mysql2',
            connection: {
              host : '127.0.0.1',
              user : 'root',
              password : 'root',
              database : 'db_posts'
            },
            pool: { min: 0, max: 7 }
          });
    }

    return pool;
}





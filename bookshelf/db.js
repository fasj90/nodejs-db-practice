const bookshelf = require('bookshelf');
const db = require('../knex/db');

module.exports = bookshelf(db.getPoolConnection());
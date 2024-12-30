const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'vaishak1234',
    password: '1234',
    database: 'recipe_database',
    connectionLimit: 5
});

module.exports = pool;

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'user',
    password: '3ek3h1R6JH72SQ87',
    host: '109.120.189.44',
    port: 5432,
    database: 'PostgreSQL-5822'
});


module.exports = pool;



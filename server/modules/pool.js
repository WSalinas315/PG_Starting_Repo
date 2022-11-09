const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library',          // this is the DATABASE name. It can be something else
    host: 'localhost',          // where your DB lives
    port: 5432,                 // this is the default for postgres
    max: 10,                    // max queries at once
    idleTimeoutMillis: 30000    // 30 seconds to try to connect, otherwise cancel query
});

// not required but very useful for debugging
pool.on('connect', () => {
    console.log('PostgreSQL is connected! Shoutout Node!');
});

pool.on('error', (error) => {
    console.log('Error with PostgreSQL:', error);
});

module.exports = pool;
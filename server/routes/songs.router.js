const express = require('express');
const router = express.Router();
// .. in path goes up a directory
const pool = require('../modules/pool');

// require pg
// const pg = require('pg');
// const Pool = pg.Pool;
// const pool = new Pool({
//     database: 'music_library',          // this is the DATABASE name. It can be something else
//     host: 'localhost',          // where your DB lives
//     port: 5432,                 // this is the default for postgres
//     max: 10,                    // max queries at once
//     idleTimeoutMillis: 30000    // 30 seconds to try to connect, otherwise cancel query
// });

// // not required but very useful for debugging
// pool.on('connect', () => {
//     console.log('PostgreSQL is connected! Shoutout Node!');
// });

// pool.on('error', (error) => {
//     console.log('Error with PostgreSQL:', error);
// });

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    //res.send(songs);
    // getting songs from the database
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText).then((result) => {
        console.log('result.rows :', result.rows);
        res.send(result.rows);
    }).catch((error) => {
        console.log(`Error making query: ${queryText}, error is`, error);
        sendStatus(500);
    })
});

// get results for specific artist
router.get('/:artist', (req, res) => {
    //res.send(songs);
    const artist = req.params.artist;
    // getting songs from the database
    let queryText = `
        SELECT * FROM "songs"
        WHERE "artist" = $1
        ORDER BY "rank" DESC
    ;`;
    pool.query(queryText, [artist]).then((result) => {    //exact
    //pool.query(queryText, [%+artist+%]).then((result) => {        // non-exact and the queryText needs where "artist" ilike or like $1
        console.log('result.rows :', result.rows);
        res.send(result.rows);
    }).catch((error) => {
        console.log(`Error making query: ${queryText}, error is`, error);
        sendStatus(500);
    })
});

router.post('/', (req, res) => {
    //songs.push(req.body);
    //res.sendStatus(200);
    const newSong = req.body;
    const queryText = `
        INSERT INTO "songs" ("artist","track","published","rank")
        VALUES ($1, $2, $3, $4);
        `;
        //VALUES ('${newSong.artist}','${newSong.track}','${newSong.published}','${newSong.rank}')
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank]).then((result) => {
        console.log('POST result from db: ', result);
        res.sendStatus(201);
    }).catch((error) => {
        console.log(`Error making query ${queryText}, error is:`, error);
        sendStatus(500);
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('Delete request for ID:', id);
    const queryText = `DELETE FROM "songs" WHERE "id" = $1;`;
    pool.query(queryText, [id]).then((result) => {
        console.log('Song deleted!');
        res.sendStatus(200);
    }).catch((error) => {
        console.log(`Error deleting with query ${queryText}, error is:`, error);
        sendStatus(500);
    })
})

module.exports = router;
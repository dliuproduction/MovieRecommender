/**
 * Created by Dennis on 11/19/2016.
 */
var http = require('http');
var Pool = require('pg').Pool;
var copyTo = require('pg-copy-streams').to;
var fs = require('fs');

// by default the pool will use the same environment variables
// as psql, pg_dump, pg_restore etc:
// https://www.postgresql.org/docs/9.5/static/libpq-envars.html

// you can optionally supply other values
var config = {
    host: '159.203.30.223',
    user: 'postgres',
    password: 'teamsolomid',
    database: 'db',
    max: 10, // max number of clients in pool
};

// create the pool somewhere globally so its lifetime
// lasts for as long as your app is running
var pool = new Pool(config)

pool.on('error', function(e, client) {
    // if a client is idle in the pool
    // and receives an error - for example when your PostgreSQL server restarts
    // the pool will catch the error & let you handle it here
});

//check out a client for multiple operations, releasing it when done.
pool.connect(function(err, client, release) {
    // TODO - you'll want to handle the error in real code

    client.query('SELECT name, overview, genre_ids FROM public.tv', function(err, result) {
        // you MUST return your client back to the pool when you're done!
        release();
        for (var i = 0; i<3; i++){
            console.log(result.rows[i].name);
            console.log(result.rows[i].overview);
            console.log(result.rows[i].genre_ids);// attempt to output table values
        }
    });
});

//attempt to copy entire table db from psql to STDOUT and pipe to a file through fileStream
// pool.connect(function(err, client, done) {
//     var fileStream = fs.createWriteStream('./logFile.tsv');
//     var stream = client.query(copyTo('COPY db TO STDOUT'));
//     fileStream.on('error', done);
//     stream.pipe(fileStream);
//     stream.on('end', done);
//     stream.on('error', done);
// });


    // pool.query('INSERT INTO visit (date) VALUES ($1)', [new Date()], function(err) {
    //     if (err) return onError(err);
    //
    //     // get the total number of visits today (including the current visit)
    //     pool.query('SELECT COUNT(date) AS count FROM visit', function(err, result) {
    //         // handle an error from the query
    //         if(err) return onError(err);
    //         res.writeHead(200, {'content-type': 'text/plain'});
    //         res.end('You are visitor number ' + result.rows[0].count);
    //     });
    // });


// pool.query('CREATE TABLE IF NOT EXISTS visit (date timestamptz)')
//     .then(function() {
//         server.listen(3001, function() {
//             console.log('server is listening on 3001')
//         })
//     })
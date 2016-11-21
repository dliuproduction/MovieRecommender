/**
 * Created by Dennis on 11/19/2016.
 */
var http = require('http');
var Pool = require('pg').Pool;
var copyTo = require('pg-copy-streams').to;
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/**
 * CONFIG for accessing the database
 * @type {{host: string, user: string, password: string, database: string, max: number}}
 */
var config = {
    host: '159.203.30.223',
    user: 'postgres',
    password: 'teamsolomid',
    database: 'db',
    max: 10, // max number of clients in pool
};

// create a pool of clients
var pool = new Pool(config)

pool.on('error', function(e, client) {
    // if a client is idle in the pool
    // and receives an error - for example when your PostgreSQL server restarts
    // the pool will catch the error & let you handle it here
});

//check out a client for multiple operations, releasing it when done.

app.use(bodyParser.json())

app.use(function(req,res,next){
    res.set('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.set('Access-Control-Allow-Credentials', true);
    next()
})
//
// pool.connect(function(err, client, release) {
//     client.query('SELECT name, imdbid FROM public.tv WHERE imdbid=\'tt0436992\';',[], function (err, result) {
//         console.log(result.rows[0].name);
//         console.log(result.rows[0].imdbid);
//     });
// });


app.post('/dataQuery', function(req, res) {

    function cb(){
        res.send(JSON.stringify(table));
    }
    console.log("Got a POST request from client");
    // console.log("The content received is:\n" + req.body);
    // console.log(typeof(req.body));

    var ids = req.body;

    for (var i = 0; i <= ids.length-1; i++ ){
        ids[i] = "'" + ids[i] + "'";
    }

    var table = []; // table to return

        pool.connect(function(err, client, release) {
            client.query('SELECT poster_path, ' +
                'name, ' +
                'overview, ' +
                'first_air_date, ' +
                'imdbid FROM public.tv WHERE imdbid IN [ids[0],ids[1]];',[], function (err, result) {
                // for (var i = 0; i <= ids.length-1; i++) {
                //     while (true) {
                //         for (var j = 0; j <= result.rows.length-1; j++) {
                //             // console.log("\n" + result.rows[i].name);
                //             console.log(ids[i]);
                //             console.log(result.rows[j].imdbid);
                //             if (ids[i].localeCompare(result.rows[j].imdbid)==0) {
                //                 console.log("show found");
                table.push
                ({
                    "poster_path": result.rows[0].poster_path,
                    "name": result.rows[0].name,
                    "overview": result.rows[0].overview,
                    "first_air_date": result.rows[0].first_air_date,
                    "imdbid": result.rows[0].imdbid
                });
                console.log(table);

                cb();

                //                         break;
                //                     }
                //                 }
                //             }
                //         }
                //     });
                // });
            });
        });
});

var server = app.listen(8888, function(){

    console.log("listening on port " + server.address().port);
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



var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.set('Access-Control-Allow-Credentials', true);
	next();
});

app.post('/F1', function (req, res) {
	console.log(req.body);
	var working = JSON.parse(req.body);
	working[1];
	res.send();
	res.end('Got a POST request');
	
})

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^all example server-side code


//////////////////////////HTML AJAXvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

var dbInfo(data1){
$.ajax({
						type: "POST",
            url: "",
            contentType:'application/json',
            data: JSON.stringify(data1)								//this is going to be object array sent to recommender
}).done(function(data2){
    // this will be run when the AJAX request succeeds
		$.ajax({
						type: "POST",
            url: "TBD",
            contentType:'application/json',
            data: JSON.stringify(["ttdfdaff","fdafsd",'dfasdfdafd'])								//this is going to be string array sent to DB
		})
}).done(function(movieInfo){
		console.log(movieInfo);	
	});
};























//F1
$.ajax({
            type: "POST",
            url: "TBD",
            contentType:'application/json',
            data: JSON.stringify(3NamesofMovies),
            success: function (data) {
        		alert(data);
            	console.log("I GOT 3 IDs TO SEND TO PYTHON");
            }
      
});

//F2
$.ajax({
            type: "POST",
            url: "TBD",
            contentType:'application/json',
            data: JSON.stringify(3IDsToSendToRecommender),
            success: function (data) {
        		alert(data);
            	console.log("I GOT 10 IDs TO SEND TO DB");
            }
        });

//F3
$.ajax({
            type: "POST",
            url: "TBD",
            contentType:'application/json',
            data: JSON.stringify(10IDtoGetInformation),
            success: function (data) {
        		alert(data);
            	console.log("I GOT 10 Movies Information");
            }
        });






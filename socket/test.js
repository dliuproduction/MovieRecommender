var express = require('express')
var app = express()
var bodyParser = require('body-parser')

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
app.get('/test.html', function (req, res) {
  res.sendFile(__dirname+"/test.html")
})
app.post('/testing', function (req, res) {
	console.log(req.body);
	
  	res.end('Got a POST request');
})

/*Start listening*/
app.listen(3000,function(){
	console.log("listening to port 3000");
});
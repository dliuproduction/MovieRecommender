var app = require('express')();
// var http = require('http').Server(app);
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
var express = require('express');

server.listen(port, '0.0.0.0', function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;


var sampleQuestion =[
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it",
"Give me a TV show that you like",
"How would you rate it"
]

var recommandationTvShows=["name1","name2","name3","name4","name5"]
var recommandationTvShowsUrl = ["https://unsplash.it/200","https://unsplash.it/200","https://unsplash.it/200"]
var questionNumber = 0;
// var finishQuestionnaire = false;
io.on('connection', function (socket) {
  var addedUser = false;
  var userProfile = {};
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    ++questionNumber;

    socket.question = sampleQuestion[questionNumber];
    userProfile[socket.username].push(data);
    console.log("data is ",userProfile[socket.username]);

    // if (questionNumber>4){
    //   // socket.emit("recommandation",recommandationTvShowsUrl);
    //   var userProfileLength = userProfile[socket.username].length
    //   socket.emit("finish Questionnaire",{
    //     username:socket.username,
    //     message: "finish Questionnaire",
    //     lastAnswer:userProfile[socket.username][userProfileLength-1]
    //   });
    //   // finishQuestionnaire= true;
    //   // return;
    // }


    //  send the next quesion
    socket.emit("question",{
      username:socket.username,
      message:socket.question
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    console.log("number user ",numUsers);
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    userProfile[username] = []
    socket.question = sampleQuestion[questionNumber];
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

    //  echo the first question
    socket.emit("question",{
      username:socket.username,
      message:socket.question
    });
  });


  socket.on("ack",function(fn){
    fn("this is the call back function");
  })
  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});


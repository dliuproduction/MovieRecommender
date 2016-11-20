var app = require('express')();
// var http = require('http').Server(app);
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
var express = require('express');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;


var sampleQuestion =["what you like?",
"what type of TV shows you like",
"what is your faviourite TV shows language",
]

var recommandationTvShows=["name1","name2","name3","name4","name5"]
var questionNumber = 0;
var finishQuestionnaire = false;
io.on('connection', function (socket) {
  var addedUser = false;
  var userProfile = {};
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    ++questionNumber;

    socket.question = sampleQuestion[questionNumber];

    if (socket.question===undefined){
      socket.emit("recommandation",recommandationTvShows);
      socket.emit("finish Questionnaire",{
        username:socket.username,
        message: "finish Questionnaire"
      });
      finishQuestionnaire= true;
    }

    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   message: data
    // });
    userProfile[socket.username].push(data);
    console.log("data is ",userProfile[socket.username]);
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

  // when the client emits 'typing', we broadcast it to others
  // socket.on('typing', function () {
  //   socket.broadcast.emit('typing', {
  //     username: socket.username
  //   });
  // });

  // // when the client emits 'stop typing', we broadcast it to others
  // socket.on('stop typing', function () {
  //   socket.broadcast.emit('stop typing', {
  //     username: socket.username
  //   });
  // });
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


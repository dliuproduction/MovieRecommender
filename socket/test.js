var express = require("express");
var app = express();
app.get('/', function(req, res){
  res.render('test');
});

var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var server = binaryServer({port: 9001});

server.on('connection', function(client) {
  console.log("setup up connection on port 9001");

var fileWriter = null;

client.on('stream', function(stream, meta) {
  var fileWriter = new wav.FileWriter('demo.wav', {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });
  stream.pipe(fileWriter);
  stream.on('end', function() {
    fileWriter.end();
  });
});

client.on('close', function() {
  if (fileWriter != null) {
    fileWriter.end();
  }
});
});
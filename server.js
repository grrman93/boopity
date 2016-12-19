var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

app.use(express.static(__dirname));
var EXPRESS_PORT = 3000;

server.listen(process.env.PORT || EXPRESS_PORT);
console.log('Listening on port, ' + (process.env.PORT || EXPRESS_PORT));

var Lobby = require('./server_util/Lobby.js');

var counter = 4;

var lobby = new Lobby();

lobby.createRoom('test');


io.on('connection', function(socket) {
  lobby.joinRoom('test', socket.id, socket, io)

  console.log('A user connected with socket id', socket.id);

  socket.on('disconnect', function() {
    lobby.leaveRoom(socket.id, socket);
    console.log('A user disconnected with socket id', socket.id);
  });

  socket.on('offer', function(missive) {
    missive = JSON.parse(missive)
    socket.broadcast.emit('peer' + missive.from + ' offer to peer' + missive.to, JSON.stringify(missive.data));
  })

  socket.on('answer', function(missive) {
    missive = JSON.parse(missive);
    socket.broadcast.emit('peer' + missive.from + ' answer to peer' + missive.to, JSON.stringify(missive.data));
  })

})














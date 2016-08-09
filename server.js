var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

app.use(express.static(__dirname));

server.listen(3000);
console.log('Listening on port 3000');

var counter = 4;

io.on('connection', function(socket) {
  
  console.log(counter);
  socket.id = counter;
  counter--;

  socket.emit('ID', socket.id);

  console.log('A user connected with socket id', socket.id);
  // socket.broadcast.emit('ask');
  // console.log('asking...')

  socket.on('disconnect', function() {
    console.log('A user disconnected with socket id', socket.id);
  });

  socket.on('offer', function(data) {
    console.log('making an offer')
    socket.broadcast.emit('accept offer', data);
  });

  socket.on('answer', function(data) {
    console.log('making an answer')
    socket.broadcast.emit('accept answer', data)
  });
})
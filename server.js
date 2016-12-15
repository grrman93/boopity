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

var counter = 4;

io.on('connection', function(socket) {
  
  console.log(counter);
  socket.id = counter;
  counter--;

  socket.emit('ID', socket.id);
  console.log('s' + socket.id + ' created')
  socket.broadcast.emit('s' + socket.id + ' created')

  console.log('A user connected with socket id', socket.id);
  // socket.broadcast.emit('ask');
  // console.log('asking...')

  socket.on('disconnect', function() {
    //******* TEMPORARY *******//
    counter++;
    console.log(counter)
    //************************ //
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

  socket.on('connected', function(missive) {
    missive = JSON.parse(missive);
    socket.broadcast.emit(missive.from + ' connected to ' + missive.to);
  })
})














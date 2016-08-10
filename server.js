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

  //Peer 4 handlers
  // peer3 to peer4 connection handling
  socket.on('peer3 offer to peer4', function(data) { socket.broadcast.emit('peer3 offer to peer4', data); })
  socket.on('peer4 answer to peer3', function(data) { socket.broadcast.emit('peer4 answer to peer3', data); })
  // peer2 to peer4 connection handling
  socket.on('peer2 offer to peer4', function(data) { socket.broadcast.emit('peer2 offer to peer4', data); })
  socket.on('peer4 answer to peer2', function(data) {socket.broadcast.emit('peer4 answer to peer2', data); })
  // peer1 to peer4 connection handling
  socket.on('peer1 offer to peer4', function(data) { socket.broadcast.emit('peer1 offer to peer4', data); })
  socket.on('peer4 answer to peer1', function(data) {socket.broadcast.emit('peer4 answer to peer1', data); })

  // Peer 3 handlers
  // peer2 to peer3 connection handling
  socket.on('peer2 offer to peer3', function(data) { socket.broadcast.emit('peer2 offer to peer3', data); })
  socket.on('peer3 answer to peer2', function(data) {socket.broadcast.emit('peer3 answer to peer2', data); })
  // peer1 to peer3 connection handling
  socket.on('peer1 offer to peer3', function(data) { socket.broadcast.emit('peer1 offer to peer3', data); })
  socket.on('peer3 answer to peer1', function(data) {socket.broadcast.emit('peer3 answer to peer1', data); })

  //Peer 2 handler
  //peer 1 to peer2 connection handling
  socket.on('peer1 offer to peer2', function(data) { socket.broadcast.emit('peer1 offer to peer2', data); })
  socket.on('peer2 answer to peer1', function(data) {socket.broadcast.emit('peer2 answer to peer1', data); })

  // connection handling, important for the ordering of connections
  socket.on('4 connected to 2', function() { socket.broadcast.emit('4 connected to 2') }) 
  socket.on('4 connected to 1', function() { socket.broadcast.emit('4 connected to 1') })
  socket.on('3 connected to 1', function() { socket.broadcast.emit('3 connected to 1') })

  // testing connections
  socket.on('2 connected to 1', function() { console.log('SUCCESS?'); socket.emit('2 connected to 1') })
  socket.on('send test', function() { socket.emit('send test') })
})














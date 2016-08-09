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

  // peer3 to peer4 connection handling
  socket.on('peer3 offer to peer4', function(data) { socket.broadcast.emit('peer3 offer to peer4', data); })
  socket.on('peer4 answer to peer3', function(data) { socket.broadcast.emit('peer4 answer to peer3', data) })
  // peer2 to peer4 connection handling
  socket.on('peer2 offer to peer4', function(data) { socket.broadcast.emit('peer2 offer to peer4', data); })
  socket.on('peer4 answer to peer2', function(data) {socket.broadcast.emit('peer4 answer to peer2', data);})
  // peer1 to peer4 connection handling
  socket.on('peer1 offer to peer4', function(data) { socket.broadcast.emit('peer1 offer to peer4', data); })
  socket.on('peer4 answer to peer1', function(data) {socket.broadcast.emit('peer4 answer to peer1', data);})


  // peer2 to peer3 connection handling
  socket.on('peer2 offer to peer3', function(data) { socket.broadcast.emit('peer2 offer to peer3', data); })
  socket.on('peer3 answer to peer2', function(data) {socket.broadcast.emit('peer3 answer to peer2', data);})
  // peer1 to peer3 connection handling
  socket.on('peer1 offer to peer3', function(data) { socket.broadcast.emit('peer1 offer to peer3', data); })
  socket.on('peer3 answer to peer1', function(data) {socket.broadcast.emit('peer3 answer to peer1', data);})

  //peer 1 to peer2 connection handling
  socket.on('peer1 offer to peer2', function(data) { socket.broadcast.emit('peer1 offer to peer2', data); })
  socket.on('peer2 answer to peer1', function(data) {socket.broadcast.emit('peer2 answer to peer1', data);})

  // connection handling
  socket.on('4 connected to 2', function() {
    console.log('4 connected to 2')
    socket.broadcast.emit('4 connected to 2')
  }) 

  socket.on('4 connected to 1', function() {
    socket.broadcast.emit('4 connected to 1')
  })

  socket.on('3 connected to 1', function() {
    socket.broadcast.emit('3 connected to 1')
  })



  socket.on('offer', function(data) {
    console.log('making an offer')
    socket.broadcast.emit('accept offer', data);
  });
  socket.on('answer', function(data) {
    console.log('making an answer')
    socket.broadcast.emit('accept answer', data)
  });

  socket.on('connected s3', () => { socket.emit('connected s3') })
  socket.on('connected s2', () => { socket.emit('connected s2') })

  // Offers
  socket.on('s1 answer', (data) => { socket.broadcast.emit('accept s1 answer', data) })
  socket.on('s2 answer', (data) => { socket.broadcast.emit('accept s2 answer', data) })
  socket.on('s3 answer', (data) => { socket.broadcast.emit('accept s3 answer', data) })

  // Answers
  socket.on('s3 offer', (data) => { socket.broadcast.emit('accept s3 offer', data) })
  socket.on('s2 offer', (data) => { socket.broadcast.emit('accept s2 offer', data) })
  socket.on('s4 offer', (data) => { socket.broadcast.emit('accept s4 offer', data) })


  // sRoutes.s3_connected(())
  

})














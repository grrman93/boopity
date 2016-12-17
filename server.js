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

var lobby = new Lobby();

lobby.createRoom('test');


io.on('connection', function(socket) {
  
  // console.log(counter);
  // socket.id = counter;
  // counter--;
  
  // socket.emit('ID', socket.id);
  // console.log('s' + socket.id + ' created')
  // socket.broadcast.emit('s' + socket.id + ' created')

  lobby.joinRoom('test', socket.id)

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

  // socket.on('connected', function(missive) {
  //   missive = JSON.parse(missive);
  //   socket.broadcast.emit(missive.from + ' connected to ' + missive.to);
  // })
})

// Lobby class to hold rooms
var Lobby = function() {
  this._rooms = {};
  this._maxRoomSize = 4;
}

// This function will create a room
Lobby.prototype.createRoom = function(roomID) {
  if (this._rooms[roomID] !== undefined) { return 'Room already exists'; }
  this._rooms[roomID] = new Room(roomID);
}

// This function deletes a given room
Lobby.prototype.deleteRoom = function(roomID) {
  if (this._rooms[roomID] === undefined) {
    return 'This room does not exist'
  }
  delete this._rooms[roomID];
}

// This function joins a room that already exists
Lobby.prototype.joinRoom = function(roomID, userID, userData) {
  if (this._rooms[roomID].size() > this._maxRoomSize) {
    return 'Room is full';
  }
  this._rooms[roomID].addUser(userID, userData);
}

// Room class
var Room = function(roomID) {
  this._ID = roomID;
  this._users = {};
  this._size = 0;
}

Room.prototypes.getUserIDs = function() {
  return Object.keys(this._users).bind(this);
}

Room.prototype.size = function() {
  return this._size;
}

Room.prototype.addUser = function(userID, userData) {
  // second argument is queue
  this._connectPeers(userID, this.getUserIDs);
  // emit socket event to do connections
  
}

Room.prototype.removeUser = function(userID) {
  if (this._users[userID] === undefined) { return 'User not in room'}
  delete this._users[userID];
}

Room.prototype.connectPeers(userID, queue) {
  var receiver = queue.pop();
  var initiator = userID;
  socket.broadcast.to(initiator).emit('makeInitiator');
  socket.broadcast.to(receiver).emit('makeReceiver');
  socket.on('connected', function() {
    if (queue.length > 0) {
      this.connectPeers(userID, queue);
    }
  }.bind(this));
}














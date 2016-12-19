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
Lobby.prototype.joinRoom = function(roomID, userID, socket) {
  if (this._rooms[roomID].size() > this._maxRoomSize) {
    return 'Room is full';
  }
  this._rooms[roomID].addUser(userID, socket);
}

Lobby.prototype.leaveRoom = function(userID, socket) {
  const roomID = this._getRoomIDFromUserID(userID);
  console.log('Removing user...')
  this._rooms[roomID].removeUser(userID, socket);
}

Lobby.prototype._getRoomIDFromUserID = function(userID) {
  const keys = Object.keys(this._rooms);
  for (let i = 0; i < keys.length; i++) {
    if (this._rooms[keys[i]]._users[userID] !== undefined) {
      return keys[i];
    }
  }
  return 'user not in room'
}

// Room class
var Room = function(roomID) {
  this._ID = roomID;
  this._users = {};
  this._size = 0;
}

Room.prototype.getUserIDs = function() {
  return Object.keys(this._users);
}

Room.prototype.size = function() {
  return this._size;
}

Room.prototype.addUser = function(userID, socket) {
  console.log('Adding socket...')
  if (this.getUserIDs().length !== 0) {
    console.log('Connecting peers...')
    // third argument acts as queue of other peers (their IDs) to connect with
    this._connectPeers(userID, socket, this.getUserIDs());
  }
  this._users[userID] = true;
}

Room.prototype.removeUser = function(userID, socket) {
  if (this._users[userID] === undefined) { return 'User not in room'}
  delete this._users[userID];

  Object.keys(this._users).forEach(function(user) {
    socket.broadcast.to(user).emit('remove peer', userID)
  }.bind(this))
}

Room.prototype._connectPeers = function (userID, socket, queue) {
  var connectToOtherSockets = function() {
    if (queue.length === 0) { console.log('I am listener that should not be open'); }
    socket.removeListener('connected', connectToOtherSockets)
    console.log('Recursing')
    this._connectPeers(userID, socket, queue);
    console.log('In RC: ', 'ID: ', socket.id, ' events: ', socket._events)
  }

  connectToOtherSockets = connectToOtherSockets.bind(this);

  if (queue.length === 0) { return; }

  var receiver = queue.pop();
  var initiator = userID;

  io.to(initiator).emit('make initiator', { initiator, receiver });
  io.to(receiver).emit('make receiver', { initiator, receiver });

  if (queue.length > 0) {
    socket.on('connected', connectToOtherSockets);
  }
  console.log('ID: ', socket.id, ' events: ', socket._events)
}

var lobby = new Lobby();

lobby.createRoom('test');


io.on('connection', function(socket) {
  lobby.joinRoom('test', socket.id, socket)

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














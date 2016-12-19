var Room = require('./Room.js')

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
Lobby.prototype.joinRoom = function(roomID, userID, socket, io) {
  if (this._rooms[roomID].size() > this._maxRoomSize) {
    return 'Room is full';
  }
  this._rooms[roomID].addUser(userID, socket, io);
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

module.exports = Lobby;

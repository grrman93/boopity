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

Room.prototype.addUser = function(userID, socket, io) {
  console.log('Adding socket...')
  if (this.getUserIDs().length !== 0) {
    console.log('Connecting peers...')
    // third argument acts as queue of other peers (their IDs) to connect with
    this._connectPeers(userID, socket, this.getUserIDs(), io);
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

Room.prototype._connectPeers = function (userID, socket, queue, io) {
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

// what if I could destroy the socket after the webrtc connection has failed and then just keep a listener on the 
// webrtc connection to see if I need to open another one.  this would probably mean keeping client ids and socket ids seperat
// OR just assign the new socket the old socket id upon reopening connection
// abstract out connecting and disconnecting like you already have Join + connecting now you need onSocketDisconnect -> prod user, reconnect or leave, if stay then reopen connection.  also need to distinguish between disconnecting and leaving....or just have the are you sure you want to leave message? but don't have it get caught in an infinite loop ECHleave?

//also another idea is to only pass one argument, data around as an object.  cleaner
// another idea is to build an http signalling server for kicks (security reasons?)
//

module.exports = Room;

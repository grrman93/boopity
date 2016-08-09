var Peer = require('simple-peer')
// var p = new Peer({ initiator: location.hash === '#1', trickle: false })
var io = require('socket.io-client');

var socket = io();

socket.on('ID', function(socketId) {
  if (socketId === 1) {
    console.log('I AM PEER ', socketId);
    var p2 = new Peer({ initiator: true, trickle: false })
    var p3 = new Peer({ initiator: true, trickle: false })
    var p4 = new Peer({ initiator: true, trickle: false })

    peerHandler(p4, true, 4);
    peerHandler(p3, true, 3);
    peerHandler(p2, true, 2);
  } else if (socketId === 2) {
    console.log('I AM PEER ', socketId);
    var p1 = new Peer({ initiator: false, trickle: false })
    var p3 = new Peer({ initiator: true, trickle: false })
    var p4 = new Peer({ initiator: true, trickle: false })

    peerHandler(p4, true, 4);
    peerHandler(p3, true, 3);
    peerHandler(p1, false, 1);
  } else if (socketId === 3) {
    console.log('I AM PEER ', socketId);
    var p1 = new Peer({ initiator: false, trickle: false })
    var p2 = new Peer({ initiator: false, trickle: false })
    var p4 = new Peer({ initiator: true, trickle: false })

    peerHandler(p4, true, 4);
    peerHandler(p2, false, 2);
    peerHandler(p1, false, 1);
  } else if (socketId === 4) {
    console.log('I AM PEER ', socketId);
    var p1 = new Peer({ initiator: false, trickle: false })
    var p2 = new Peer({ initiator: false, trickle: false })
    var p3 = new Peer({ initiator: false, trickle: false })

    peerHandler(p3, false, 3);
    peerHandler(p2, false, 2);
    peerHandler(p1, false, 1);
  }
});


// var io = require('socket.io');

// var p = new Peer({ initiator: true, trickle: false })



function peerHandler(p, initiatorCheck, ID) {
  console.log("instantiated");
  p.on('error', function (err) { console.log('error', err) })

  if(!initiatorCheck) {
    peerInitiator(p, ID);
  } else {
    peerReciever(p, ID);
  }

  p.on('connect', function () {
    console.log('CONNECT')
    p.send('whatever' + Math.random())
  })

  p.on('data', function (data) {
    console.log('data: ' + data)
  })
};

function peerReciever(p, ID) {
  socket.on('accept answer', function (data){
    console.log('Socket ' + ID + ' recieved an offer');
    p.signal(JSON.parse(data));
  })

  p.on('signal', function(data) {
    console.log('TYPE TEST: ', data.type);
    // console.log('SIGNAL', JSON.stringify(data))
    
    if(data.type === 'offer') {
      console.log('offer tripped, socketID: ', ID)
      socket.emit('offer', JSON.stringify(data));
    }
  })
};

function peerInitiator(p, ID) {
  socket.on('accept offer', function (data){
    console.log('Socket ' + ID + ' recieved an answer');
    p.signal(JSON.parse(data));
  })

  p.on('signal', function(data) {
    console.log('TYPE TEST: ', data.type);
    // console.log('SIGNAL', JSON.stringify(data))

    if(data.type === 'answer') {
      console.log('answer tripped, socketID: ', ID)
      socket.emit('answer', JSON.stringify(data));
    }
  })
};

var Peer = require('simple-peer')
// var p = new Peer({ initiator: location.hash === '#1', trickle: false })
var io = require('socket.io-client');


var socket = io();

socket.on('ID', function(socketId) {
  if (socketId === 1) {
    console.log('I AM PEER ', socketId);
    // first offer
    var p4 = new Peer({ initiator: true, trickle: false })
    peerHandler(p4, true, 4, socketId);

    // second offer, need to wait for first to finish
    socket.on('4 connected to 1', function() {
      var p3 = new Peer({ initiator: true, trickle: false })
      peerHandler(p3, true, 3, socketId);
    })

    // third offer, need to wait for first to finish
    socket.on('3 connected to 1', function() {
      var p2 = new Peer({ initiator: true, trickle: false })
      peerHandler(p2, true, 2, socketId);
    })
  } else if (socketId === 2) {
    console.log('I AM PEER ', socketId);

    // first offer
    var p4 = new Peer({ initiator: true, trickle: false })
    peerHandler(p4, true, 4, socketId); 

    // second offer, need to wait to for first to finish
    socket.on('4 connected to 2', function(){
      console.log('peer2 now initializing connection to peer3')
      var p3 = new Peer({ initiator: true, trickle: false })
      peerHandler(p3, true, 3, socketId);
    })

    // answer, need to wait for 3 to finish
    socket.on('3 connected to 1', function() {
      var p1 = new Peer({ initiator: false, trickle: false })
      peerHandler(p1, false, 1, socketId);
    })

    

    // // var p1 = new Peer({ initiator: false, trickle: false })
    // peerHandler(p1, false, 1);
  } else if (socketId === 3) {
    console.log('I AM PEER ', socketId);


    // give offer
    var p4 = new Peer({ initiator: true, trickle: false })
    peerHandler(p4, true, 4, socketId);

    // first answer, need to wait for 4 to connect first
    socket.on('4 connected to 2', function(){
      console.log("s3 got news of s4/s2 connection, now initializing connection to peer2")
      var p2 = new Peer({ initiator: false, trickle: false })
      peerHandler(p2, false, 2, socketId);
    })

    // second answer need to wait for 4 to connect first
    socket.on('4 connected to 1', function() {
      var p1 = new Peer({ initiator: false, trickle: false })
      peerHandler(p1, false, 1, socketId);
    })
    // var p1 = new Peer({ initiator: false, trickle: false })

    // peerHandler(p2, false, 2);
    // peerHandler(p1, false, 1);
  } else if (socketId === 4) {
    console.log('I AM PEER ', socketId);

    socket.on('s3 created', function() {
      console.log('s4 saw s3 created');
      // this will recieve offer
      var p3 = new Peer({ initiator: false, trickle: false })
      peerHandler(p3, false, 3, socketId);
    })

    socket.on('s2 created', function() {
      console.log('s4 saw s2 created');
      var p2 = new Peer({ initiator: false, trickle: false })
      peerHandler(p2, false, 2, socketId);
    })

    socket.on('s1 created', function() {
      console.log('s4 saw s1 created');
      var p1 = new Peer({ initiator: false, trickle: false })
      peerHandler(p1, false, 1, socketId);
    })




    // socket.on('connected s3', function() {
    //   console.log('recvieved message')
    // })
    // listen();
    // // socket.on('s3 connected', () => {
    // var p3 = new Peer({ initiator: false, trickle: false })
    // peerHandler(p3, false, 3);

    // var p2 = new Peer({ initiator: false, trickle: false })
    // peerHandler(p2, false, 2);
    // // })
    // socket.on('s2 created', () => {
    //   console.log("s4 got news of s2's creation")
    // })


    // socket.on('connected s3', () => {
    //   console.log('connected s3')
    // })
    // socket.on('s3 offer', (data) => { 
    // })

    // var p3 = new Peer({ initiator: false, trickle: false })
    // var p2 = new Peer({ initiator: false, trickle: false })
    // var p1 = new Peer({ initiator: false, trickle: false })

    // peerHandler(p3, false, 3);
    // peerHandler(p2, false, 2);
    // peerHandler(p1, false, 1);
  }
});

function peerHandler(p, initiatorCheck, ID, sID) {
  console.log("instantiated, ID: ", ID);
  p.on('error', function (err) { console.log('error', err) })

  if (!initiatorCheck) {
    peerReciever(p, ID, sID);
  } else {
    peerInitiator(p, ID, sID);
  }

  p.on('connect', function () {
    console.log(sID + ' connected to ' + ID)
    socket.emit(sID + ' connected to ' + ID)
    p.send('whatever' + Math.random())
  })

  p.on('data', function (data) {
    console.log('data: ' + data)
  })
};

function peerInitiator(p, ID, sID) {
  console.log('peer' + sID + ' made initiator for peer' + ID)
  socket.on('peer' + ID + ' answer to peer' + sID, function(data) {
    p.signal(JSON.parse(data));
  })
  // socket.on('accept s'+ID+' answer', function (data){
  //   console.log('Socket ' + ID + ' recieved an offer');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s1 answer', function (data){
  //   console.log('Socket ' + ID + ' recieved an answer s1');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s2 answer', function (data){
  //   console.log('Socket ' + ID + ' recieved an answer s2');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s3 answer', function (data){
  //   console.log('Socket ' + ID + ' recieved an answer from s3');
  //   p.signal(JSON.parse(data));
  // })

  p.on('signal', function(data) {
    console.log('TYPE TEST: ', data.type);
    // console.log('SIGNAL', JSON.stringify(data))
    
    if(data.type === 'offer') {
      console.log('peer' + sID + ' sent offer to peer' + ID)
      socket.emit('peer' + sID + ' offer to peer' + ID, JSON.stringify(data));
    }
  })
};

function peerReciever(p, ID, sID) {
  console.log('peer' + sID + ' made reciever for peer' + ID)
  socket.on('peer' + ID + ' offer to peer' + sID, function(data) {
    p.signal(JSON.parse(data));
  })
  // socket.on('accept s'+ ID +' offer', function (data){
  //   console.log('Socket ' + ID + ' recieved an answer');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s3 offer', function (data){
  //   console.log('Socket ' + ID + ' recieved an offer from s3');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s2 offer', function (data){
  //   console.log('Socket ' + ID + ' recieved an offer s2');
  //   p.signal(JSON.parse(data));
  // })

  // socket.on('accept s4 offer', function (data){
  //   console.log('Socket ' + ID + ' recieved an offer s4');
  //   p.signal(JSON.parse(data));
  // })

  p.on('signal', function(data) {
    console.log('TYPE TEST: ', data.type);
    // console.log('SIGNAL', JSON.stringify(data))

    if(data.type === 'answer') {
      console.log('peer' + sID + ' sent answer to peer' + ID);
      socket.emit('peer' + sID + ' answer to peer' + ID, JSON.stringify(data));
    }
  })
};

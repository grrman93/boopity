var Peer = require('simple-peer')
var io = require('socket.io-client');

var socket = io();

var peers = [];

window.showPeers = function() {
  console.log(peers);
}

socket.on('remove peer', function(targetID) {
  for (let i = 0; i < peers.length; i++) {
    if (peers[i].peerID === targetID) {
      // destroy peer
      peers[i].peer.destroy();
      // take out of peers array
      peers.splice(i, 1);
      // remove video in DOM
      const video = document.getElementById(targetID);
      document.querySelector('body').removeChild(video);
      break;
    }
  }
});

navigator.mediaDevices.getUserMedia({ video: {width: {max: 320}, height: {max: 240} }, audio: true })
  .then(function(stream) {

    var video = document.createElement('video');
    video.src = window.URL.createObjectURL(stream);
    video.id = socket.id;
    document.querySelector('body').append(video);
    video.play();

  });

socket.on('make initiator', function(data) {
  navigator.mediaDevices.getUserMedia({ video: {width: {max: 320}, height: {max: 240} }, audio: true })
    .then(function(stream) {

    // var video = document.createElement('video');
    // video.src = window.URL.createObjectURL(stream);
    // video.id = socket.id + ' initiator';
    // document.querySelector('body').append(video);
    // video.play();

    console.log('working on intiator')
    var peer = new Peer({ 
      initiator: true,
      trickle: false,
      stream: stream,
      config: { 
        iceServers: [
          {url: "stun:stun.l.google.com:19302"},
          // {url: "stun:stun1.l.google.com:19302"},
          // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
          // {url: "stun:stun3.l.google.com:19302"},
          // {url: "stun:stun4.l.google.com:19302"},
        ]
      }
    });

    document.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault()
      console.log('TESTING ev: ', ev);
      peer.send('HELOOOO')
    })

    peerHandler(peer, true, data.initiator, data.receiver)
    peers.push({ peer, peerID: data.receiver });
  });
});

socket.on('make receiver', function(data) {
  navigator.mediaDevices.getUserMedia({ video: {width: {max: 320}, height: {max: 240} }, audio: true })
    .then(function(stream) {

    // var video = document.createElement('video');
    // video.src = window.URL.createObjectURL(stream);
    // video.id = socket.id + ' receiver';
    // document.querySelector('body').append(video);
    // video.play();

    console.log('working on receiver')
    var peer = new Peer({ 
      initiator: false,
      trickle: false,
      stream: stream,
      config: { 
        iceServers: [
          {url: "stun:stun.l.google.com:19302"},
          // {url: "stun:stun1.l.google.com:19302"},
          // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
          // {url: "stun:stun3.l.google.com:19302"},
          // {url: "stun:stun4.l.google.com:19302"},
        ]
      }
    });

    document.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault()
      console.log('TESTING poop: ev: ', ev);
      peer.send('HELOOOO')
    })

    peerHandler(peer, false, data.receiver, data.initiator)
    peers.push({ peer, peerID: data.initiator });
  });
})
/*
socket.on('ID', function(socketId) {
  navigator.mediaDevices.getUserMedia({ video: {width: {max: 320}, height: {max: 240} }, audio: true })
    .then(function(stream) {
    var video = document.getElementById(socketId);
    console.log(video)
    console.log('I ama video')
    video.src = window.URL.createObjectURL(stream);
    video.play();

      if (socketId === 1) {
        var p4, p3, p2;
        console.log('I AM PEER ', socketId);
        // first offer
        p4 = new Peer({ 
          initiator: true,
          trickle: false,
          stream: stream,
          config: { 
            iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
           })
        peerHandler(p4, true, 4, socketId);

        // second offer, need to wait for first to finish
        socket.on('4 connected to 1', function() {
          p3 = new Peer({ 
            initiator: true, 
            trickle: false, 
            stream: stream, 
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p3, true, 3, socketId);
        })

        // third offer, need to wait for first to finish
        socket.on('3 connected to 1', function() {
          p2 = new Peer({ 
            initiator: true, 
            trickle: false, 
            stream: stream, 
            config: { iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p2, true, 2, socketId);
        })

        document.querySelector('form').addEventListener('submit', function (ev) {
          ev.preventDefault()
          console.log('TESTING');
          p4.send('HELLO FROM PEER 1')
          p3.send('HELLO FROM PEER 1')
          p2.send('HELLO FROM PEER 1')
        })


        // socket.on('2 connected to 1', function() {
        //   socket.emit('send test');
        // })

      } else if (socketId === 2) {
        console.log('I AM PEER ', socketId);
        var p4, p3, p1;
        // first offer
        p4 = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
          config: {
            iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
        peerHandler(p4, true, 4, socketId); 

        // second offer, need to wait to for first to finish
        socket.on('4 connected to 2', function(){
          // console.log('peer2 now initializing connection to peer3')
          p3 = new Peer({ 
            initiator: true, 
            trickle: false, 
            stream: stream, 
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p3, true, 3, socketId);
        })

        // answer, need to wait for 3 to finish
        socket.on('3 connected to 1', function() {
          p1 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p1, false, 1, socketId);
        })

        document.querySelector('form').addEventListener('submit', function (ev) {
          ev.preventDefault()
          console.log('TESTING');
          p4.send('HELLO FROM PEER 2')
          p3.send('HELLO FROM PEER 2')
          p1.send('HELLO FROM PEER 2')
        })
      } else if (socketId === 3) {
        console.log('I AM PEER ', socketId);

        var p4, p2, p1;
        // give offer
        p4 = new Peer({ 
          initiator: true, 
          trickle: false,
          stream: stream,
          config: { 
            iceServers: [
              {url: "stun:stun.l.google.com:19302"},
              // {url: "stun:stun1.l.google.com:19302"},
              // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
              // {url: "stun:stun3.l.google.com:19302"},
              // {url: "stun:stun4.l.google.com:19302"},
            ]
          }
        })
        peerHandler(p4, true, 4, socketId);

        // first answer, need to wait for 4 to connect first
        socket.on('4 connected to 2', function(){
          // console.log("s3 got news of s4/s2 connection, now initializing connection to peer2")
          p2 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p2, false, 2, socketId);
        })

        // second answer need to wait for 4 to connect first
        socket.on('4 connected to 1', function() {
          p1 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p1, false, 1, socketId);
        })

        document.querySelector('form').addEventListener('submit', function (ev) {
          ev.preventDefault()
          console.log('TESTING');
          p4.send('HELLO FROM PEER 3')
          p2.send('HELLO FROM PEER 3')
          p1.send('HELLO FROM PEER 3')
        })
      } else if (socketId === 4) {
        console.log('I AM PEER ', socketId);

        var p3, p2, p1;

        socket.on('s3 created', function() {
          // console.log('s4 saw s3 created');
          // this will recieve offer
          p3 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p3, false, 3, socketId);
        })

        socket.on('s2 created', function() {
          // console.log('s4 saw s2 created');
          p2 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p2, false, 2, socketId);
        })

        socket.on('s1 created', function() {
          // console.log('s4 saw s1 created');
          p1 = new Peer({ 
            initiator: false,
            trickle: false,
            stream: stream,
            config: { 
              iceServers: [
                {url: "stun:stun.l.google.com:19302"},
                // {url: "stun:stun1.l.google.com:19302"},
                // {url: "stun:stun2.l.google.com:19302"},                                                                                                                              
                // {url: "stun:stun3.l.google.com:19302"},
                // {url: "stun:stun4.l.google.com:19302"},
              ]
            }
          })
          peerHandler(p1, false, 1, socketId);
        })

        document.querySelector('form').addEventListener('submit', function (ev) {
          ev.preventDefault()
          console.log('TESTING');
          p3.send('HELLO FROM PEER 4')
          p2.send('HELLO FROM PEER 4')
          p1.send('HELLO FROM PEER 4')
        })
      }
    });
});
*/
// FIX LATER --> ID is me, sID (socket ID) is the other ID
function peerHandler(p, initiatorCheck, ID, sID) {
  // console.log("instantiated, ID: ", ID);
  p.on('error', function (err) { console.log('error', err) })

  if (!initiatorCheck) {
    peerReciever(p, ID, sID);
  } else {
    peerInitiator(p, ID, sID);
  }

  p.on('connect', function () {
    // console.log(sID + ' connected to ' + ID)
    // socket.emit(sID + ' connected to ' + ID)
    // refactor
    var missive = {
      from: sID,
      to: ID,
    }
    socket.emit('connected', JSON.stringify(missive));
    p.send('HELLO FROM PEER' + sID);
  })

  socket.on('send test', function() {
    p.send('HELLO AGAIN FROM PEER' + sID);
  })

  p.on('data', function (data) {
    console.log('data: ' + data)
  })

  p.on('stream', function(stream) {
    // console.log('y u no work')
    var video = document.createElement('video');
    video.src = window.URL.createObjectURL(stream);
    video.id = sID;
    document.querySelector('body').append(video);
    video.play();
  })
};

function peerInitiator(p, ID, sID) {
  // console.log('peer' + sID + ' made initiator for peer' + ID)
  socket.on('peer' + ID + ' answer to peer' + sID, function(data) {
    p.signal(JSON.parse(data));
  })

  p.on('signal', function(data) {
    // console.log('TYPE TEST: ', data.type);
    
    if(data.type === 'offer') {
      // console.log('peer' + sID + ' sent offer to peer' + ID)
      // socket.emit('peer' + sID + ' offer to peer' + ID, JSON.stringify(data));
      // refactor
      var missive = {
        from: sID,
        to: ID,
        data,
      };
      socket.emit('offer', JSON.stringify(missive));
    }
  })
};

function peerReciever(p, ID, sID) {
  // console.log('peer' + sID + ' made reciever for peer' + ID)
  socket.on('peer' + ID + ' offer to peer' + sID, function(data) {
    p.signal(JSON.parse(data));
  })

  p.on('signal', function(data) {
    // console.log('TYPE TEST: ', data.type);

    if(data.type === 'answer') {

      // console.log('peer' + sID + ' sent answer to peer' + ID);
      // socket.emit('peer' + sID + ' answer to peer' + ID, JSON.stringify(data));
      // refactor
      var missive = {
        from: sID,
        to: ID,
        data,
      };
      socket.emit('answer', JSON.stringify(missive))
    }
  })
};


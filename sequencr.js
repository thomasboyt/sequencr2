// DEPENDENCIES -------------------------------------------------------------
var express = require('express')
  , http    = require('http')
  , path    = require('path');

// express() returns a function, which we store in app
var app    = express()
// we pass this function as the only argument to Node's http.createServer(),
// which returns an http.Server instance we store in `server`
  , server = http.createServer(app)
// we then pass the http.Server instance to socket.io's listen() method
  , io     = require('socket.io').listen(server);

// CONFIG -------------------------------------------------------------------
app.configure(function(){

  // set options
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // use middleware
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

server.listen(8080);

// ROUTE (SPA, just one route) ----------------------------------------------
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// SOCKET.IO STUFF ----------------------------------------------------------
// usernames which are currently connected to the chat
var usernames = {};

// run this function when there's a new connection
io.sockets.on('connection', function( socket ) {

  socket.on('buttonClick', function( stepNumber, trackNumber ) {
    io.sockets.emit('toggleButton', stepNumber, trackNumber );
  });

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function( data ) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data);
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function( username ){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // send out 'updateusers' event
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});

var player = {
  currentStep: 0
};





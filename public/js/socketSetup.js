(function() {
  // connect to localhost port 8080
  window.socket = io.connect( 'http://localhost:8080' );

  // run when server emits 'connect' event
  socket.on('connect', function() {
    // emit an 'adduser' event with the argument provided by prompt()
    // socket.emit('adduser', prompt("What's your name?"));
  });

  // when we receive a 'togglebutton' event, toggle the damn button
  socket.on('toggleButton', function( stepNumber, trackNumber ) {
    SQ.vent.trigger('button:toggle', stepNumber, trackNumber );
  });

  // run when server emits 'updateusers' event
  socket.on('updateusers', function( data ) {
    // clear the user list
    $('#users').empty();
    // append each user to the list
    $.each(data, function( user, value ) {
      $('#users').append('<div>' + user + '</div>');
    });
  });
})();
(function(){

  // save mouse state for UI stuff
  
  var mouseClicked = false;

  $(document).mousedown(function() {
    mouseClicked = true;
  });

  $(document).mouseup(function() {
    mouseClicked = false;
  });

  var buttonChangeStack = [];

  // implicit globals, cool or no?
  window.SQ = {
    Models      : {},
    Views       : {},
    Collections : {}
  };

  // Create an events handler
  SQ.vent = _.extend( {}, Backbone.Events );

  // a startlingly simple button model
  SQ.Models.Button = Backbone.Model.extend({
    defaults: {
      on         : false,
      stepNumber : 0
    }
  });

  // a simple button view
  SQ.Views.Button = Backbone.View.extend({

    tagName   : 'td',
    className : 'button',

    // top level controller
    events: {
      // 'click' : 'emitToggle',
      // 'mousedown': 'emitToggle'
      
      'mousedown' : 'emitToggle',
      'mouseenter': 'toggleMouseenter'
    },

    // set up listener to 'change' event
    initialize: function() {
      this.model.on('change', this.render, this);
    },

    // adds/removes class of 'on' to a given button
    render: function() {
      this.model.get('on') ? this.$el.addClass('on') : this.$el.removeClass('on');
      return this;
    },

    emitToggle: function() {
      // send message to server
      socket.emit('buttonClick', this.model.get('stepNumber'));
    },

    toggle: function() {
      var currentState = this.model.get('on');
      this.model.set( 'on', !currentState );
    },

    toggleMouseenter: function() {
      if ( mouseClicked ) {
        this.emitToggle();
      }
    }
  });

  // track collection
  SQ.Collections.Track = Backbone.Collection.extend({
    model: SQ.Models.Button
  });

  // track view
  SQ.Views.Track = Backbone.View.extend({

    tagName   : 'tr',

    initialize: function() {

      SQ.vent.on('button:toggle', this.toggleButton, this);

      // fill the track with buttons
      for (var i = 0; i < 16; i++) {
        this.collection.push( new SQ.Models.Button({ stepNumber: i }));
      } 

      // for each button in the collection, create a view 
      this.collection.each( function( button ) {
        var buttonView = new SQ.Views.Button({ model: button});
        this.$el.append( buttonView.el );
      }, this);
    },

    toggleButton: function( stepNumber ) {
      // save for easy reading
      thisButton = this.collection.models[ stepNumber ];
      // get current state
      var currentState = thisButton.get('on');
      // toggle current state
      thisButton.set( 'on', !currentState );
      console.log('it works!');
    }
  });
})();
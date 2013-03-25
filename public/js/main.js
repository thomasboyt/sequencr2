(function(){

  // save mouse state for UI stuff
  var mouseClicked = false,
      stateClicked;

  function stateMatches( state ) {
    return state === stateClicked;
  }

  $(document).mousedown(function() {
    mouseClicked = true;
  });

  $(document).mouseup(function() {
    mouseClicked = false;
  });

  var buttonChangeStack = [];

  // global SQ object
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
      playing    : false,
      stepNumber : 0,
      trackNumber: 0
    }
  });

  // a simple button view
  SQ.Views.Button = Backbone.View.extend({

    tagName   : 'td',
    className : 'button',

    // top level controller
    events: {
      'mousedown' : 'toggleMousedown',
      'mouseenter': 'toggleMouseenter'
    },

    // set up listener to 'change' event
    initialize: function() {

      this.model.on('change', this.render, this);

      SQ.vent.on('button:toggle'  , this.toggleButton, this);
      SQ.vent.on('button:playStep', this.playStep    , this);
      SQ.vent.on('button:reset'   , this.resetButton , this);
    },

    // adds/removes class of 'on' to a given button
    render: function() {
      this.model.get('on') ? this.$el.addClass('on') : this.$el.removeClass('on');

      if (this.model.get('playing')) {
        this.$el.addClass('playing');
        var that = this;
        setTimeout(function() {
          that.model.set('playing', false);
        }, 300);
      } else {
        this.$el.removeClass('playing');
      }
      
      return this;
    },

    emitToggle: function() {
      // send message to server
      socket.emit('buttonClick', this.model.get('stepNumber'), this.model.get('trackNumber'));
    },

    toggleMousedown: function() {
      // set stateClicked global
      stateClicked = this.model.get('on');
      this.emitToggle();
    },

    toggleMouseenter: function() {
      if ( mouseClicked && stateMatches(this.model.get('on')) ) {
        this.emitToggle();
      }
    },

    toggleButton: function( stepNumber, trackNumber ) {
      if ( this.model.get('stepNumber')  === stepNumber
        && this.model.get('trackNumber') === trackNumber) {
        var currentState = this.model.get('on');
        this.model.set( 'on', !currentState );
      }
    },

    playStep: function( stepNumber ) {
      if ( this.model.get('stepNumber') === stepNumber 
        && this.model.get('on')) {
        this.model.set('playing', true);
        // setTimeout( this.triggerReset, 300 );
      }
    },

    triggerReset: function() {
      console.log('trigger button:reset');
      SQ.vent.trigger('button:reset');
    },

    resetButton: function() {
      console.log('resetButton');
      this.model.set('playing', false);
    }

  });

  // track collection
  SQ.Collections.Track = Backbone.Collection.extend({
    model  : SQ.Models.Button
  });

  // track view
  SQ.Views.Track = Backbone.View.extend({

    tagName   : 'tr',

    initialize: function() {

      // fill the track with buttons
      for (var i = 0; i < 16; i++) {
        this.collection.push( new SQ.Models.Button({ 
          stepNumber  : i,
          trackNumber : this.collection.number
        }));
      } 

      // for each button in the collection, create a view 
      this.collection.each( function( button ) {
        var buttonView = new SQ.Views.Button({ model: button});
        this.$el.append( buttonView.el );
      }, this);
    }
  });
})();
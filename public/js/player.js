(function() {

  var playerTemplate = function( id ) {
    return _.template( $('#' + id).html() )
  }

  // Player model
  SQ.Models.Player = Backbone.Model.extend({
    defaults: {
      player: 0,
      currentStep: 0
    }
  });

  // Player view
  SQ.Views.Player  = Backbone.View.extend({
    tagName: 'div',
    id     : 'player',

    template: playerTemplate( 'player' ),

    events: {
      'click button.play': 'emitPlay',
      'click button.stop': 'emitStop'
    },

    initialize: function() {
      this.model.on('change', this.render, this);

      SQ.vent.on('player:play'    , this.play    , this);
      SQ.vent.on('player:stop'    , this.stop    , this);
      SQ.vent.on('player:playStep', this.playStep, this);
    },

    render: function() {
      this.$el.html( this.template(this.model.toJSON()) );
      return this;
    },

    emitPlay: function() {
      socket.emit('play');
    },

    play: function() {
      // var that = this;
      this.player = setInterval( this.triggerPlay, 200 );
    },

    triggerPlay: function() {
      SQ.vent.trigger('player:playStep');
    },

    playStep: function() {
      var currentStep = this.model.get('currentStep');

      SQ.vent.trigger('button:playStep', currentStep);

      if (currentStep === 15) {
        this.model.set('currentStep', 0);
      } else {
        this.model.set('currentStep', currentStep + 1);
      }
    },

    emitStop: function() {
      console.log('emitting stop');
      socket.emit('stop');
    },

    stop: function() {
      this.model.set('currentStep', 0);
      clearInterval( this.player );
    }
  });
})();
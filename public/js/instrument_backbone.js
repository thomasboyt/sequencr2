(function(){
  
  window.App = {
    Models     : {},
    Collections: {},
    Views      : {}
  };

  // // Template helper function
  // window.template = function( id ) {
  //   return _.template( $('#' + id).html() );
  // };

  // Button model
  App.Models.Button = Backbone.Model.extend({
    defaults: {
      on     : false,
    }
  });

  // Button view
  App.Views.Button = Backbone.View.extend({

    tagName    : 'td',
    className  : 'button',

    events     : {
      'click':'toggleOn'
    },

    // render on change
    initialize : function() {
      this.model.on('change', this.render, this)
    },

    // give class of 'on' if button model's on property is true
    render     : function() {
      this.model.get('on') ? this.$el.addClass('on') : this.$el.removeClass('on');
      return this;
    },

    // toggles 'on' property of button model
    toggleOn   : function() {
      this.model.set('on', !this.model.get('on'));
    }
  });

  // Tracks are collections of buttons
  SQ.Collections.Track = Backbone.Collection.extend({
    model: App.Models.Button
  });

  // Track View
  SQ.Views.Track = Backbone.View.extend({

    tagName   : 'tr',
    // className : 'track',

    initialize: function() {

      // for each button in the collection, create a view 
      this.collection.each( function( button ) {
        var buttonView = new App.Views.Button({ model: button});
        this.$el.append( buttonView.el );
      }, this);
    },

    render    : function() {
      // take care of muting and soloing here
      return this;
    }
  });

  // fill in track
  track = [];
  for (var i = 0; i < 16; i++ ) {
    track.push( new App.Models.Button() );
  }
 
  // create track collection instance
  track1     = new App.Collections.Track( track );

  // create trackView instance
  trackView1 = new App.Views.Track({ collection: track1 });

  $('#sequencr').append( trackView1.el );
})();

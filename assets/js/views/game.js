define(function(require) {
  var Backbone = require('backbone');

  var GameView = Backbone.View.extend({
    initialize: function() {
    },

    render: function() {
      this.$el.html('game');
    },

    show: function(loader) {
      loader(function(cb) {
        this.trigger('show');
        this.render();
        this.$el.show();
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return GameView;
});


define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var gameTemplate = require('templates/game');

  var gameView = Backbone.View.extend({
    template: gameTemplate,
    initialize: function() {
      this.render();
    },

    render: function() {
      var html = gameTemplate();
      this.$el.html(html);
      return this;
    }
  });

  return new gameView();
});

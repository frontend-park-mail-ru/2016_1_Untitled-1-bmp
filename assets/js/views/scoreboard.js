define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var scoreboardTemplate = require('templates/scoreboard');

  var scoreboardView = Backbone.View.extend({
    template: scoreboardTemplate,
    initialize: function() {
      this.render();
    },

    render: function() {
      var html = scoreboardTemplate();
      this.$el.html(html);
      return this;
    }
  });

  return new scoreboardView();
});

define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var scoreboardTemplate = require('templates/scoreboard');
  var scoreModel = require('models/score');

  var scoreboardView = Backbone.View.extend({
    template: scoreboardTemplate,
    initialize: function() {
      this.render();
      var a = new scoreModel({name: 'aaa', score: 100});
      console.log(a);
    },

    render: function() {
      var html = scoreboardTemplate();
      this.$el.html(html);
      return this;
    }
  });

  return new scoreboardView();
});

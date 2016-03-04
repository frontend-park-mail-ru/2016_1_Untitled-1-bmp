define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/main');
  var waves = require('waves');

  var MainView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.render();
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      var wave = this.$el.find('.wave');
      waves(wave);
    }
  });

  return new MainView();
});

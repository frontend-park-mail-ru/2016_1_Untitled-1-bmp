define(function(require) {
  var Backbone = require('backbone');

  var MainView = Backbone.View.extend({
    initialize: function() {
      this.template = require('templates/main');
      this.render();
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      var wave = this.$el.find('.wave');
      require('waves')(wave);
    }
  });

  return new MainView();
});

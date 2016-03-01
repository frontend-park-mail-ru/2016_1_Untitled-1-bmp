define(function(require) {
  var Backbone = require('backbone');

  var LoginView = Backbone.View.extend({
    initialize: function() {
      this.template = require('templates/login');
      this.render();
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    }
  });

  return new LoginView();
});

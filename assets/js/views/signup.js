define(function(require) {
  var Backbone = require('backbone');

  var SignupView = Backbone.View.extend({
    initialize: function() {
      this.template = require('templates/signup');
      this.render();
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    }
  });

  return new SignupView();
});

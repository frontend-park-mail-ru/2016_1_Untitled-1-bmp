define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var template = require('templates/user-login');

  var UserLogin = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.render();
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    show: function() {
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return UserLogin;
});

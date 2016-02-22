define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var loginTemplate = require('templates/login');

  var loginView = Backbone.View.extend({
    template: loginTemplate,
    initialize: function() {
      this.render();
    },

    render: function() {
      var html = loginTemplate();
      this.$el.html(html);
      return this;
    }
  });

  return new loginView();
});

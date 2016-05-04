define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/main');
  var app = require('app');

  var MainView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.render();
    },

    render: function() {
      var authData = app.getAuthData();
      var html = this.template({
        isAuth: authData.isAuth,
        userLogin: authData.user.get('login')
      });
      this.$el.html(html);
    },

    show: function(loader) {
      loader(function(cb) {
        this.trigger('show');
        this.$el.show();
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
    },

    onAuth: function() {
      this.render();
    }
  });

  return MainView;
});

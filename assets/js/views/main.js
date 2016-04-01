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

    show: function(parent) {
      this.trigger('show')
      parent.empty();
      parent.append(this.el);
    },

    hide: function() {
    },

    onAuth: function() {
      this.render();
    }
  });

  return MainView;
});

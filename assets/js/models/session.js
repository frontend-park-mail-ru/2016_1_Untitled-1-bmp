define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var Session = Backbone.Model.extend({
    defaults: {
      auth: false
    },

    urlRoot: '/api/session',

    initialize: function() {
      this.fetch({
        success: (function(udata) {
          this.set('auth', true);
        }).bind(this),
        error: (function(udata) {
          this.set('auth', false);
        }).bind(this)
      });
    },

    isAuthorized: function() {
      return this.auth;
    },

    tryLogin: function(login, password) {
      $.post(
        this.urlRoot,
        JSON.stringify({
          'login': login,
          'password': password
        })).done(
        function(data) {
          console.log(data);
        })
        .fail(function(data) {
          console.log(data)
        });
    }
  });

  return Session;
});


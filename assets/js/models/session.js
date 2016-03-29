define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var Session = Backbone.Model.extend({
    defaults: {
      auth: false
    },

    url: '/api/session',

    initialize: function() {
    },

    check: function() {
      this.set('id', null);
      this.fetch({
        success: (function(udata) {
          this.set('auth', true);
          this.trigger('auth_true');
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
      if(this.isNew()) {
        this.save({
          login: login,
          password: password
        }, {
          success: (function(data) {
            this.set('auth', true);
            this.trigger('auth_true');
          }).bind(this),
          error: (function(data) {
            this.set('auth', false);
            this.trigger('auth_fail');
          }).bind(this)
        });
      }
    },

    logout: function() {
      this.destroy({
        success: (function(data) {
          this.set('auth', false);
          this.trigger('auth_logout');
        }).bind(this)
      });
    }
  });

  return Session;
});


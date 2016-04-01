define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Session = require('models/session');
  var User = require('models/user');

  var App = Backbone.Model.extend({
    session: new Session(),
    user: new User(),

    initialize: function() {
      this.listenTo(this.session, 'auth', (function(result) {
        if(result.result) {
          this.user.set('id', result.id);
          this.user.fetch({
            success: (function() {
              this.trigger('auth', this.getAuthData());
            }).bind(this)
          });
        }
      }).bind(this));

      this.listenTo(this.session, 'logout', (function() {
        this.user.clear();
        this.session.clear();
        this.trigger('auth', this.getAuthData());
      }).bind(this));

      this.session.listenTo(this.user, 'register', (function() {
        this.session.check();
      }).bind(this));

      this.session.check();
    },

    getSession: function() {
      return this.session;
    },

    getUser: function() {
      return this.user;
    },

    getAuthData: function() {
      return {
        isAuth: this.session.isAuthorized(),
        user: this.user
      };
    }
  });

  return new App();
});

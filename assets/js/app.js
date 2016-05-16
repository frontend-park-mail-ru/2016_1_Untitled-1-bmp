define(function(require) {
  var Backbone = require('backbone');
  var Session = require('models/session');
  var User = require('models/user');

  var App = Backbone.Model.extend({
    session: new Session(),
    user: new User(),
    offline: false,

    initialize: function() {
      this.listenTo(this.session, 'auth', this._onAuth.bind(this));
      this.listenTo(this.session, 'logout', this._onLogout.bind(this));
      this.listenTo(this.session, 'offline', this._onOffline.bind(this));

      this.session.listenTo(this.user, 'register', this.session.check.bind(this.session));
    },

    start: function(cb) {
      this.session.check(cb);
    },

    getSession: function() {
      return this.session;
    },

    getUser: function() {
      return this.user;
    },

    isOffline: function() {
      return this.offline;
    },

    getAuthData: function() {
      return {
        isAuth: this.session.isAuthorized(),
        user: this.user
      };
    },

    _onAuth: function(result) {
      if(result.result) {
        this.user.set('id', result.id);
        this.user.fetch({
          success: (function() {
            this.trigger('auth', this.getAuthData());
          }).bind(this)
        });
      }
    },

    _onLogout: function() {
      this.user.clear();
      this.session.clear();
      this.trigger('auth', this.getAuthData());
    },

    _onOffline: function() {
      this.offline = true;
    }
  });

  return new App();
});

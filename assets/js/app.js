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
              var authData = {
                'isAuth': true,
                'user': this.user
              };
              this.trigger('auth', authData);
            }).bind(this)
          });
        }
      }).bind(this));

      this.listenTo(this.session, 'logout', (function() {
        this.user.clear();
        var authData = {
          'isAuth': false,
          'user': this.user
        };
        this.trigger('auth', authData);
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
    }
  });

  return new App();
});

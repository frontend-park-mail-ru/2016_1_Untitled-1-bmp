define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Session = require('models/session');
  var User = require('models/user');

  var App = Backbone.Model.extend({
    session: new Session(),
    user: new User(),

    initialize: function() {
      this.user.listenTo(this.session, 'auth_true', (function() {
        this.user.set('id', this.session.get('id'));
        this.user.fetch();
      }).bind(this));
      this.user.listenTo(this.session, 'auth_logout', (function() {
        this.user.clear();
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

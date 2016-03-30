define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Session = require('models/session');
  var User = require('models/user');

  var App = Backbone.Model.extend({
    session: new Session(),
    user: new User(),

    initialize: function() {
      this.user.listenTo(this.session, 'auth_success', (function(udata) {
        this.set('id', udata.id);
        this.fetch();
      }).bind(this.user));
      this.user.listenTo(this.session, 'auth_logout', (function() {
        this.user.clear();
      }).bind(this));
      this.session.check();

      this.session.listenTo(this.user, 'register_success', (function(udata) {
        this.check();
      }).bind(this.session));
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

define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      LoginView = require('views/login');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var loginView = new LoginView();

  _.each([mainView,
         scoreboardView,
         loginView], function(view) {
           viewManager.addView(view);
  });

  var loader = require('loader');

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      'login': 'loginAction',
      'signup': 'signupAction',
      '*default':   'defaultAction',
    },

    go: function(where) {
      return this.navigate(where, { trigger: true });
    },

    defaultAction: function() {
      mainView.show(loader);
    },

    scoreboardAction: function() {
      scoreboardView.show(loader);
    },

    loginAction: function() {
      loginView.show(loader, 'login');
    },

    signupAction: function() {
      loginView.show(loader, 'signup');
    }
  });

  return new Router();
});

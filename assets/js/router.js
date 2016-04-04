define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      GameView = require('views/game'),
      LoginView = require('views/login'),
      SignupView = require('views/signup');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var gameView = new GameView();
  var loginView = new LoginView();
  var signupView = new SignupView();

  _.each([mainView,
         scoreboardView,
         gameView,
         loginView,
         signupView], function(view) {
           viewManager.addView(view);
  });

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      'game':       'gameAction',
      'login':      'loginAction',
      'logout':     'logoutAction',
      'signup':     'signupAction',
      '*default':   'defaultAction',
    },

    go: function(where) {
      return this.navigate(where, { trigger: true });
    },

    defaultAction: function () {
      mainView.show();
    },

    scoreboardAction: function () {
      scoreboardView.show();
    },

    gameAction: function () {
      gameView.show();
    },

    loginAction: function () {
      loginView.show();
    },

    logoutAction: function () {
      app.getSession().logout();
      this.go('');
    },

    signupAction: function () {
      signupView.show();
    }
  });

  return new Router();
});

define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
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
      'signup':     'signupAction',
      '*default':   'defaultAction',
    },

    $page: $('#page'),

    defaultAction: function () {
      mainView.show(this.$page);
    },

    scoreboardAction: function () {
      scoreboardView.show(this.$page);
    },

    gameAction: function () {
      gameView.show(this.$page);
    },

    loginAction: function () {
      loginView.show(this.$page);
    },

    signupAction: function () {
      signupView.show(this.$page);
    }
  });

  return new Router();
});

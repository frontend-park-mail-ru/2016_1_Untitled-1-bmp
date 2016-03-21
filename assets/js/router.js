define(function (require) {
  var Backbone = require('backbone');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      GameView = require('views/game'),
      LoginView = require('views/login'),
      SignupView = require('views/signup');

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
      var mainView = new MainView();
      this.$page.html(mainView.el);
    },

    scoreboardAction: function () {
      var scoreboardView = new ScoreboardView();
      this.$page.html(scoreboardView.el);
    },

    gameAction: function () {
      var gameView = new GameView();
      this.$page.html(gameView.el);
    },

    loginAction: function () {
      var loginView = new LoginView();
      this.$page.html(loginView.el);
    },

    signupAction: function () {
      var signupView = new SignupView();
      this.$page.html(signupView.el);
    }
  });

  return new Router();
});

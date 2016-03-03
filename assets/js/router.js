define(function (require) {
  var Backbone = require('backbone');

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
      var mainView = require('views/main');
      this.$page.html(mainView.el);
    },

    scoreboardAction: function () {
      var scoreboardView = require('views/scoreboard');
      this.$page.html(scoreboardView.el);
    },

    gameAction: function () {
      var gameView = require('views/game');
      this.$page.html(gameView.el);
    },

    loginAction: function () {
      var loginView = require('views/login');
      this.$page.html(loginView.el);
    },

    signupAction: function () {
      var SignupView = require('views/signup');
      var signupView = new SignupView();
      this.$page.html(signupView.el);
    }
  });

  return new Router();
});

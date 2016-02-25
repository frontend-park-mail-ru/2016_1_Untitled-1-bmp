define(function (require) {
  var Backbone = require('backbone');

  var Router = Backbone.Router.extend({
    routes: {
      'main': 'defaultAction',
      'scoreboard': 'scoreboardAction',
      'new/game': 'newGameAction',
      'login': 'loginAction',
      '*default': 'defaultAction',
    },

    defaultAction: function () {
      var mainView = require('views/main');
      $('#page').html(mainView.render().el);
      var wave = require('waves');
      wave();
    },

    scoreboardAction: function () {
      var scoreboardView = require('views/scoreboard');
      $('#page').html(scoreboardView.render().el);
    },

    newGameAction: function () {
      var gameView = require('views/game');
      $('#page').html(gameView.render().el);
    },

    loginAction: function () {
      var loginView = require('views/login');
      $('#page').html(loginView.render().el);
    }
  });

  return new Router();
});

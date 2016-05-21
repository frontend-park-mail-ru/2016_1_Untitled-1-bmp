define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var alertify = require('alertify');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      UserView = require('views/user'),
      RulesView = require('views/rules'),
      GameView = require('views/game');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var userView = new UserView();
  var rulesView = new RulesView();

  var gameView = new GameView();

  _.each([mainView,
         scoreboardView,
         userView,
         rulesView,
         gameView
  ], function(view) {
           viewManager.addView(view);
  });

  var loader = require('loader');

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      'rules': 'rulesAction',
      'user/:tab': 'userAction',
      'game': 'gameAction',
      '*default': 'defaultAction',
    },

    go: function(where) {
      return this.navigate(where, { trigger: true });
    },

    goSilent: function(where) {
      return this.navigate(where, { trigger: false });
    },

    defaultAction: function() {
      mainView.show(loader);
    },

    scoreboardAction: function() {
      scoreboardView.show(loader);
    },

    rulesAction: function() {
      rulesView.show(loader);
    },

    userAction: function(tab) {
      if(app.getAuthData().isAuth) {
        this.go('');
        alertify.error('Вы уже авторизованы, мой дорогой!');
        return;
      }
      userView.show(loader);
      userView.tab(tab);
    },

    gameAction: function() {
      gameView.show(loader);
    }
  });

  return new Router();
});

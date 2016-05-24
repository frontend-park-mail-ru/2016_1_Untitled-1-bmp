define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var alertify = require('alertify');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      UserView = require('views/user'),
      RulesView = require('views/rules'),
      GameStartView = require('views/game-start');

  var viewManager = require('views/manager');

  var gameProvider = require('models/game/game-provider');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var userView = new UserView();
  var rulesView = new RulesView();
  var gameStartView = new GameStartView();

  _.each([mainView,
         scoreboardView,
         userView,
         rulesView,
         gameStartView
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
      if(!app.getAuthData().isAuth) {
        userView.setReturnPage('game');
        this.go('user/login');
        alertify.message('Авторизуйтесь, чтобы начать игру');
      }
      else {
        this[app.isOffline() ? '_gameOffline' : '_gameOnline']();
      }
    },

    gameStartAction: function() {
      gameStartView.show(loader);
    },

    _gameOffline: function() {
      gameProvider.once('checkOfflineGame', function(res) {
        if(!res.exists) {
          this.gameStartAction();
        }
        else {
          alertify.info('У вас есть незаконченная офлайн-игра');
          // TODO:
        }
      }.bind(this));

      loader(function() {
        gameProvider.checkOfflineGame();
      });
    },

    _gameOnline: function() {
      loader(function(hide) {
        gameProvider.once('checkOnlineGame', function(res) {
          if(!res.connection) {
            this.go('');
            alertify.error('Не удалось подключиться к серверу');
          }
          else if(!res.exists) {
            this.gameStartAction();
          }
          else {
            this.goSilent('');
            hide(function() {
              alertify.notify('У вас есть незаконченная онлайн-игра');
            });
            // TODO:
          }
        }.bind(this));
        gameProvider.checkOnlineGame();
      }.bind(this));
    }
  });

  return new Router();
});

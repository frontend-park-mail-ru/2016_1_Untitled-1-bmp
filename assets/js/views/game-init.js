define(function(require) {
  var View = require('views/base');
  var template = require('templates/game-init');

  var router;
  var app = require('app');
  var gameProvider = require('models/game/game-provider');
  var loader = require('loader');
  var alertify = require('alertify');
  var GameView = require('views/game');

  var GameInitView = View.Page.extend({
    initialize: function() {
      this.template = template;

      router = require('router');
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      this.isRendered = true;
    },

    show: function(loader) {
      if(this.isShown) return;

      this[app.isOffline() ? '_offline' : '_online']();
    },

    continueGame: function(session) {
      var view = new GameView();
      view.setGameSession(session);
      var viewManager = require('views/manager');
      viewManager.addView(view);
      view.show(loader);
      session.getStatus();
    },

    noContinueGame: function(session) {
      session.giveUp();
      loader(function(hide) {
        router.gameStartAction();
      });
    },

    _online: function() {
      loader(function(hide) {
        gameProvider.once('checkOnlineGame', function(res) {
          if(!res.connection) {
            router.go('');
            alertify.error('Не удалось подключиться к серверу');
          }
          else if(!res.exists) {
            router.gameStartAction();
          }
          else {
            alertify.confirm('Незаконченная игра',
                             'У вас есть незаконченная игра. Продолжить её?',
                             function() {
                               this.continueGame(res.session);
                             }.bind(this), function() {
                               this.noContinueGame(res.session);
                               res.session.stop();
                             }.bind(this)
                            );
          }
        }, this);
        gameProvider.checkOnlineGame();
      }.bind(this));
    },

    _offline: function() {
    },

    hide: function() {
      this.isShown = false;
    }
  });

  return GameInitView;
});

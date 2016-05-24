define(function(require) {
  var View = require('views/base');
  var template = require('templates/game');
  var fieldView = require('views/game-field');

  var scene = require('features/scene-chaos');

  var alertify = require('alertify');
  var _ = require('underscore');

  var GameView = View.Page.extend({

    events: {
      'click .js-giveup': 'onClickGiveUp'
    },

    messages: {
      'game_init': 'onMessageInit',
      'game_start': 'onMessageStart',
      'game_turn': 'onMessageTurn',
      'game_over': 'onMessageOver',
      'shoot_result': 'onMessageShoot',
      'error': 'onMessageError',
      'game_status': 'onMessageStatus',
      'opponent_online': 'onMessageOpponent',
      'game_too_long': 'onMessageTooLong'
    },

    gameSession: undefined,

    initialize: function() {
      this.template = template;
      this.fieldView = fieldView;
    },

    setGameSession: function(gameSession) {
      this.gameSession = gameSession;

      this.gameSession.on('connection', this.onConnection.bind(this));
      this.gameSession.on('message', this.onMessage.bind(this));
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      this.fieldViewMy = new this.fieldView(this.gameSession.getProps());
      this.fieldViewMy.show();
      this.fieldViewMy.setCaption('Ваше поле');
      this.fieldViewOpponent = new this.fieldView(this.gameSession.getProps());
      this.fieldViewOpponent.show();
      this.fieldViewOpponent.setCaption('Поле соперника');

      this.$el.find('.js-field-my').empty().append(this.fieldViewMy.$el);
      this.$el.find('.js-field-opponent').empty().append(this.fieldViewOpponent.$el);

      this.$status = this.$el.find('.js-status');

      this.scene = scene(this.$el.find('.scene-chaos'));

      this.isRendered = true;
    },

    show: function(loader) {
      if(this.isShown) return;

      loader(function(cb) {
        this.trigger('show');

        if(!this.isRendered) this.render();

        this.scene.start();

        this.$el.show();
        this.isShown = true;
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
      this.isShown = false;

      if(this.scene) {
        this.scene.stop();
      }
    },

    setStatus: function(status) {
      this.$status.html(status);
    },

    onClickGiveUp: function(e) {
      e.preventDefault();

      alertify.confirm('Сдаться',
                      'Игра будет считаться проигранной. Вы уверены, что хотите сдаться?',
                      function() {
                        this.gameSession.giveUp();
                      }.bind(this), function() {
                      });
    },

    onConnection: function(res) {
      console.log('game view connection', res);
    },

    onMessage: function(msg) {
      if(msg && msg.type) {
        var method = this.messages[msg.type];
        if(typeof this[method] === 'function') {
          this[method].call(this, msg);
        }
      }
    },

    onMessageInit: function(msg) {
      if(msg.ok) {
        this.setStatus('Ожидаем соперника...');
      }
      else {
        var $a = $('<a/>').attr('href', '#').text('Вернуться в главное меню');
        this.setStatus('Не удалось начать игру. ' + $a.html());
      }
    },

    onMessageStart: function(msg) {
    },

    onMessageTurn: function(msg) {
    },

    onMessageOver: function(msg) {
    },

    onMessageShoot: function(msg) {
    },

    onMessageError: function(msg) {
    },

    onMessageStatus: function(msg) {
      if(msg.opponentName) {
        this.fieldViewOpponent.setCaption('Поле ' + msg.opponentName);
      }

      if(msg.ships) {
        _.each(msg.ships, function(ship) {
          this.fieldViewMy.setCellsShip.apply(this.fieldViewMy, ship);
        }, this);
      }

      if(msg.opponentShips) {
        _.each(msg.opponentShips, function(ship) {
          var args = ship.splice(0);
          args.push(true);
          this.fieldViewOpponent.setCellsShip.apply(this.fieldViewOpponent, args);
        }, this);
      }
    },

    onMessageOpponent: function(msg) {
      this.fieldViewOpponent.setCaptionInfo(msg.ok ? 'онлайн' : 'офлайн');
    },

    onMessageTooLong: function(msg) {
    },

    showUserPanel: function() {
      return false;
    }
  });

  return GameView;
});

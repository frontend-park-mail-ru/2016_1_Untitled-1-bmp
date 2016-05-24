define(function(require) {
  var View = require('views/base');
  var template = require('templates/game');
  var fieldView = require('views/game-field');

  var scene = require('features/scene-chaos');

  var alertify = require('alertify');

  var GameView = View.Page.extend({

    events: {
      'click .js-giveup': 'onClickGiveUp'
    },

    gameSession: undefined,

    initialize: function() {
      this.template = template;
      this.fieldView = fieldView;
    },

    setGameSession: function(gameSession) {
      this.gameSession = gameSession;
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      this.fieldViewMy = new this.fieldView(this.gameSession.getProps());
      this.fieldViewMy.show();
      this.fieldViewOpponent = new this.fieldView(this.gameSession.getProps());
      this.fieldViewOpponent.show();

      this.$el.find('.js-field-my').empty().append(this.fieldViewMy.$el);
      this.$el.find('.js-field-opponent').empty().append(this.fieldViewOpponent.$el);

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

    onClickGiveUp: function(e) {
      e.preventDefault();

      alertify.confirm('Сдаться',
                      'Игра будет считаться проигранной. Вы уверены, что хотите сдаться?',
                      function() {
                        console.log('give up');
                      }, function() {
                      });
    },

    showUserPanel: function() {
      return false;
    }
  });

  return GameView;
});

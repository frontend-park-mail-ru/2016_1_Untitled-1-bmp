define(function(require) {
  var View = require('views/base');
  var template = require('templates/game');
  var fieldTemplate = require('templates/game-field');

  var scene = require('features/scene-chaos');

  var GameView = View.Page.extend({
    gameSession: undefined,

    initialize: function() {
      this.template = template;
      this.fieldTemplate = fieldTemplate;
    },

    setGameSession: function(gameSession) {
      this.gameSession = gameSession;
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

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
    }
  });

  return GameView;
});

define(function(require) {
  var View = require('views/base');
  var GameProps = require('models/game/game-props');
  var GameFieldView = require('views/game-field');
  var template = require('templates/game-start');

  var dragula = require('dragula');

  var GameStartView = View.Page.extend({
    initialize: function() {
      this.props = GameProps.get();
      this.template = template;
      this.fieldView = new GameFieldView(this.props);
    },

    render: function() {
      var ships = [];
      for(var i = 1; i <= this.props.getMaxDeck(); i++) {
        ships.push({ decks: i, count: this.props.getShips(i) });
      }

      var html = this.template({
        ships: ships
      });
      this.$el.html(html);

      this.$el.find('.js-field').append(this.fieldView.$el);
      this.fieldView.show();
      this.fieldView.setCaption('Ваше поле');

      this.isRendered = true;
    },

    show: function(loader) {
      if(this.isShown) return;

      loader(function(cb) {
        this.trigger('show');

        if(!this.isRendered) this.render();

        this.$el.show();
        this.isShown = true;
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
      this.isShown = false;
    }
  });

  return GameStartView;
});


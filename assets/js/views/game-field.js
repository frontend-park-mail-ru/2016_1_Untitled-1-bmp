define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var GameField = require('models/game/game-field');

  var template = require('templates/game-field');

  var GameFieldView = Backbone.View.extend({
    initialize: function(props) {
      this.props = props;
      this.model = new GameField(props);
    },

    render: function() {
      var html = template({
        letters: 'АБВГДЕЖЗИКЛМНОПРСТ'.split(''),
        size: this.props.getSize(),
        caption: '',
        captionInfo: ''
      });
      this.$el.html(html);

      this.$caption = this.$el.find('.js-caption');
      this.$captionInfo = this.$el.find('.js-caption-info');
    },

    setCaption: function(text) {
      this.$caption.html(text);
    },

    setCaptionInfo: function(text) {
      this.$captionInfo.html(text);
    },

    getCell: function(x, y) {
      return this.$el.find('[data-x=' + x + '][data-y=' + y + ']');
    },

    canAddShip: function(x, y, length, isVertical) {
      return this.model.checkShip(x, y, length, isVertical);
    },

    addShip: function(x, y, length, isVertical) {
      if(this.model.addShip(x, y, length, isVertical)) {
        var $cell = this.getCell(x, y);
        $cell.empty();

        var classes = [
          'js-ship',
          'page-game-start__ship',
          'page-game-start__ship_' + length
        ];

        if(isVertical) {
          classes.push('page-game-start__ship_vertical');
        }

        $cell.append($('<div />').addClass(classes.join(' ')).attr('data-decks', length));
        return true;
      }

      return false;
    },

    canMoveShip: function(x, y, _x, _y) {
      return this.model.checkMoveShip(x, y, _x, _y);
    },

    moveShip: function(x, y, _x, _y) {
      return this.model.moveShip(x, y, _x, _y);
    },

    removeShip: function(x, y) {
      if(this.model.removeShip(x, y)) {
        var $cell = this.getCell(x, y);
        $cell.empty();
        return true;
      }

      return false;
    },

    rotateShip: function(x, y) {
      if(this.model.rotateShip(x, y)) {
        var $cell = this.getCell(x, y);
        $cell.find('.js-ship').toggleClass('page-game-start__ship_vertical');
        return true;
      }

      return false;
    },

    clear: function() {
      this.$el.find('.page-game-start__ship').remove();
      this.model.clear();
    },

    setRandom: function() {
      this.clear();

      var newField = GameField.generateRandomField(this.props);
      _.each(newField.getShips(), function(ship) {
        this.addShip(ship[0], ship[1], ship[2], ship[3]);
      }, this);
    },

    isReady: function() {
      return this.model.isReady();
    },

    getShipsData: function() {
      return this.model.getShips();
    },

    show: function() {
      this.render();
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return GameFieldView;
});

define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var GameField = require('game/game-field');
  var GameFieldShip = require('game/game-field-ship');

  var template = require('templates/game-start');
  var fieldTemplate = require('templates/game-field');

  var GameStartView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.fieldTemplate = fieldTemplate;
    },

    events: {
      'click .js-ship': 'onSelectShip',
      'mouseover .game-field__cell': 'onMouseOverCell',
      'mouseout .game-field__cell': 'onMouseOutCell',
      'click .game-field__cell': 'onClickCell',
      'click .js-button-ready': 'onClickReady'
    },

    setProps: function(props) {
      this.props = props;
      this.field = new GameField(props);
    },

    render: function() {
      var ships = [];
      for(var i = 1; i <= this.props.getMaxDeck(); i++) {
        ships.push({ decks: i, count: this.props.getShips(i) });
      }

      var html = template({
        field: this.fieldTemplate({
          size: this.props.getSize()
        }),
        ships: ships
      });
      this.$el.html(html);

      this.$buttonReady = this.$el.find('.js-button-ready');
    },

    show: function(loader) {
      loader(function(cb) {
        this.trigger('show');
        this.render();
        this.$el.show();
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
    },

    onSelectShip: function(e) {
      var selectedClass = 'game-field__ship_selected';
      var leftClass = 'game-field__ship_left';
      var $ship = $(e.target);

      if($ship.hasClass(leftClass)) {
        return;
      }

      if(this.selectedShip) {
        this.selectedShip.removeClass(selectedClass);
      }

      $ship.toggleClass(selectedClass);
      this.selectedShip = $ship.hasClass(selectedClass) ? $ship : null;
    },

    onMouseOverCell: function(e) {
      var overClass = 'game-field__cell_over';
      var $cell = $(e.target);
      this.$el.find('.game-field__cell[data-x=' + $cell.data('x') + '], .game-field__cell[data-y=' + $cell.data('y') + ']').addClass(overClass);
    },

    onMouseOutCell: function(e) {
      var overClass = 'game-field__cell_over';
      var $cell = $(e.target);
      this.$el.find('.game-field__cell[data-x=' + $cell.data('x') + '], .game-field__cell[data-y=' + $cell.data('y') + ']').removeClass(overClass);
    },

    onClickCell: function(e) {
      var selectedClass = 'game-field__ship_selected';
      var leftClass = 'game-field__ship_left';
      var fieldClass = 'game-field__ship_field';
      var $cell = $(e.target);

      if(this.selectedShip) {
        var clone = $(this.selectedShip).clone().removeClass('js-ship');
        clone.removeClass(selectedClass);

        if(this.field.addShip(new GameFieldShip(
          $cell.data('x'), $cell.data('y'), clone.data('decks'), false))
          ) {
            this.$el.find('.game-field__cell[data-x=' + $cell.data('x') + '][data-y=' + $cell.data('y') + ']').append(clone.addClass(fieldClass));
            this.selectedShip.removeClass(selectedClass).addClass(leftClass);
            this.selectedShip = null;

            if(this.field.isValid()) {
              this.$buttonReady.prop('disabled', false);
            }
          }
      }
    },

    onClickReady: function() {
      if(this.field.isValid()) {
        console.log('start game!!');
      }
    }
  });

  return GameStartView;
});

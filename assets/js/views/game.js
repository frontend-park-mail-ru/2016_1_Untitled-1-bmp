define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/game');
  var fieldCreatorTemplate = require('templates/game/field-creator');
  var fieldTemplate = require('templates/game/field');

  var GameView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.fieldCreatorTemplate = fieldCreatorTemplate;
      this.fieldTemplate = fieldTemplate;

      this.step = 1;

      this.render();
    },

    render: function() {
      if(this.step == 1) {
        var size = 10;
        var html = this.fieldCreatorTemplate(
          {
            ships: [
              { cells: 4, count: 1 },
              { cells: 3, count: 2 },
              { cells: 2, count: 3 },
              { cells: 1, count: 4 }
            ],
            field: this.fieldTemplate({
              size: size
            })
          }
        );
        this.$el.html(html);

        var $el = this.$el;
        var $button = $el.find('.game-field-creator__button');
        $button.prop('disabled', true);

        var getNewShips = function() {
          var selector = '.game-field-creator__ship';
          selector += ':not(.game-field-creator__ship_field)';
          selector += ':not(.game-field-creator__ship_left)';
          return $el.find(selector);
        };

        var getSelectedShip = function() {
          return $el.find('.game-field-creator__ship_selected');
        };

        var getFieldCells = function() {
          var selector = '.game-field__cell';
          selector += ':not(.game-field__cell_header_top)';
          selector += ':not(.game-field__cell_header_left)';
          return $el.find(selector);
        };

        var getCells = function(x, y, length, vertical) {
          var check = [];
          for(var i = x; i < x + length; i++) {
            check.push([i, y]);
          }
          return check;
        };

        var getCellChecks = function(x, y, length, vertical) { // TODO: vertical
          var check = [];

          if(x + length - 1 > size) {
            return false;
          }

          if(x > 1) {
            check.push([x-1, y]);
            if(y > 1) {
              check.push([x-1, y-1]);
            }
            if(y < size) {
              check.push([x-1, y+1]);
            }
          }

          if(x + length < size) {
            check.push([x+length, y]);
            if(y > 1) {
              check.push([x+length, y-1]);
            }
            if(y < size) {
              check.push([x+length, y+1]);
            }
          }

          for(var i = x; i < x + length; i++) {
            check.push([i, y]);
          }

          if(y > 1) {
            for(var i = x; i < x + length; i++) {
              check.push([i, y-1]);
            }
          }

          if(y < size) {
            for(var i = x; i < x + length; i++) {
              check.push([i, y+1]);
            }
          }

          return check;
        };

        var checkCell = function(x, y, length, vertical) {
          var checks = getCellChecks(x, y, length, vertical);

          if(!checks) {
            return false;
          }

          var isFound = _.find(checks, function(cellc) {
            var $cell = $('.game-field__cell[data-x=' + cellc[0] + '][data-y=' + cellc[1] + ']');
            return $cell.data('busy') == true;
          });

          return !isFound;
        };

        var markBusy = function(x, y, length, vertical) {
          var checks = getCells(x, y, length, vertical);
          _.each(checks, function(cellc) {
            var $cell = $('.game-field__cell[data-x=' + cellc[0] + '][data-y=' + cellc[1] + ']');
            $cell.data('busy', true);
          });
        };

        getNewShips().on('click', function() {
          var cl = 'game-field-creator__ship_selected';
          var had = $(this).hasClass(cl);
          getSelectedShip().removeClass(cl);
          $(this).toggleClass(cl, !had);
        });

        getFieldCells().on('click', function() {
          var ship = getSelectedShip();
          if(ship.length && checkCell($(this).data('x'), $(this).data('y'), $(ship).data('cells'), false)) {
            markBusy($(this).data('x'), $(this).data('y'), $(ship).data('cells'), false);
            $(this).append(ship.clone()
                           .addClass('game-field-creator__ship_field')
                           .removeClass('game-field-creator__ship_selected')
                          );
            ship
                .removeClass('game-field-creator__ship_selected')
                .addClass('game-field-creator__ship_left');

            if(getNewShips().length === 0) {
              $button.prop('disabled', false);
            }
          }
        });
      }
    },

    show: function() {
      this.trigger('show');
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return GameView;
});

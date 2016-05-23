define(function(require) {
  var View = require('views/base');
  var GameProps = require('models/game/game-props');
  var GameFieldView = require('views/game-field');
  var template = require('templates/game-start');

  var dragula = require('dragula');

  var GameStartView = View.Page.extend({
    events: {
      'click .js-field .page-game-start__ship': 'onClickShip'
    },

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

      dragula({
        isContainer: function(el) {
          return $(el).hasClass('js-ship-line') || $(el).is('.game-field__cell[data-x][data-y]');
        },
        accepts: function(el, target, source, sibling) {
          var targetX = $(target).data('x');
          var targetY = $(target).data('y');
          var isTargetCell = targetX && targetY;

          var sourceX = $(source).data('x');
          var sourceY = $(source).data('y');
          var isSourceCell = sourceX && sourceY;

          if(!isTargetCell) {
            // remove
            return true;
          }

          if(!isSourceCell) {
            // add
            return this.fieldView.canAddShip(targetX, targetY, $(el).data('decks'), false);
          }
          else {
            // move
            return this.fieldView.canMoveShip(sourceX, sourceY, targetX, targetY);
          }

          return false;
        }.bind(this)
      }).on('drop', function(el, target, source, sibling) {
          var targetX = $(target).data('x');
          var targetY = $(target).data('y');
          var isTargetCell = targetX && targetY;

          var sourceX = $(source).data('x');
          var sourceY = $(source).data('y');
          var isSourceCell = sourceX && sourceY;

          if(!isTargetCell) {
            // remove
            $(el).removeClass('page-game-start__ship_vertical');
            this.fieldView.removeShip(sourceX, sourceY);
          }
          else if(isSourceCell) {
            // move
            this.fieldView.moveShip(sourceX, sourceY, targetX, targetY);
          }
          else {
            // add
            this.fieldView.addShip(targetX, targetY, $(el).data('decks'), false);
          }
      }.bind(this))
      .on('cloned', function(clone, original) {
        if($(original).hasClass('page-game-start__ship_vertical')) {
          $(clone).css('transform', 'rotate(0deg)');
        }
      });

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
    },

    onClickShip: function(e) {
      var $el = $(e.target);
      var $cell = $el.parent();
      var x = $cell.data('x');
      var y = $cell.data('y');

      if(this.fieldView.rotateShip(x, y)) {
        $el.toggleClass('page-game-start__ship_vertical');
      }
    }
  });

  return GameStartView;
});


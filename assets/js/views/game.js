define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/game');
  var fieldCreatorTemplate = require('templates/game/field-creator');
  var fieldTemplate = require('templates/game/field');
  var fieldCreator = require('./game/field-creator');

  var alertify = require('alertify');

  var GameView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.fieldCreatorTemplate = fieldCreatorTemplate;
      this.fieldTemplate = fieldTemplate;

      this.step = 1;

      this.render();
    },

    render: function() {
      var size = 10;
      if(this.step === 1) {
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

        var cb = (function(res) {
          this.step = 2;
          this.field1 = res.field;
          this.render();
        }).bind(this);

        fieldCreator(this.$el, size, cb);
      }
      else if(this.step === 2) {
        var field2 = this.fieldTemplate({
          size: size
        });

        var html = this.template({
          field1: this.field1,
          field2: field2
        });

        this.$el.html(html);

        var randomSequences = [
          [[1,10],[2,4],[3,2],[3,4],[3,7],[3,9],[4,2],[4,9],[5,2],[5,5],[6,2],[6,7],[8,2],[8,6],[8,9],[9,2],[9,6],[9,9],[10,6],[10,9]],
          [[1,1],[1,10],[2,1],[2,6],[2,8],[2,10],[3,6],[3,8],[3,10],[4,4],[4,10],[5,4],[6,2],[6,4],[6,7],[7,7],[8,7],[8,9],[9,2],[9,5]],
          [[1,1],[1,5],[2,3],[2,5],[2,9],[3,3],[3,5],[5,2],[5,6],[6,6],[7,1],[7,6],[8,1],[8,10],[9,1],[9,4],[9,8],[9,10],[10,1],[10,8]]
        ];

        var rand = Math.floor(Math.random() * randomSequences.length);

        _.each(randomSequences[rand], (function(cell) {
          this.$el.find('#field2 .game-field__cell[data-x='+cell[0]+'][data-y='+cell[1]+']')
                  .data('busy', true);
        }).bind(this));

        var turn2 = (function() {
          setTurn(2, 1500, (function() {
            var check = true;
            var cell, cell1, cell2;
            var i = 0;
            do {
              cell1 = Math.floor(Math.random() * size) + 1;
              cell2 = Math.floor(Math.random() * size) + 1;
              cell = this.$el.find('#field1 .game-field__cell[data-x='+cell1+'][data-y='+cell2+']');
              check = cell.hasClass('game-field__cell_busy') || cell.hasClass('game-field__cell_miss');
              i++;
            }
            while(check || i < size * size);

            if(cell.data('busy')) {
              cell.addClass('game-field__cell_busy');
              var isWin = true;
              $('#field1 .game-field__cell').each(function() {
                if($(this).data('busy') && !$(this).hasClass('game-field__cell_busy')) {
                  isWin = false;
                  return false;
                }
              });

              if(isWin) {
                alertify.alert('Game over', 'Вы проиграли! :(');
              }
              turn2();
            }
            else
            {
              cell.addClass('game-field__cell_miss');
              setTurn(1, 3000);
            }
          }).bind(this));

        }).bind(this);

        var setTurn = (function(n, wait, cb) {
          var other = n % 2 + 1;

          wait = wait || 1500;
          cb = cb || function() {};

          this.$el.find('#field' + other).animate({opacity: '1'}, wait, cb);
          this.$el.find('#field' + n).animate({opacity: '0.3'}, wait);
          this.turn = n;
        }).bind(this);

        var that = this;
        $('#field2 .game-field__cell[data-x][data-y]').on('click', function() {
          if( that.turn != 1 ||
             $(this).hasClass('game-field__cell_busy') || $(this).hasClass('game-field__cell_miss')) {
            return;
          }

          if($(this).data('busy')) {
            $(this).addClass('game-field__cell_busy');

            var isWin = true;
            $('#field2 .game-field__cell').each(function() {
              if($(this).data('busy') && !$(this).hasClass('game-field__cell_busy')) {
                isWin = false;
                return false;
              }
            });

            if(isWin) {
              alertify.alert('Game over', 'Вы выиграли!');
            }
          }
          else
          {
            $(this).addClass('game-field__cell_miss');
            turn2();
          }
        });

        setTurn(1);
      }
    },

    show: function() {
      this.trigger('show');
      this.step = 1;
      this.render();
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return GameView;
});

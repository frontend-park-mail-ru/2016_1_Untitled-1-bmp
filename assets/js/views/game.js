define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/game');
  var fieldCreatorTemplate = require('templates/game/field-creator');
  var fieldTemplate = require('templates/game/field');
  var fieldCreator = require('./game/field-creator');

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

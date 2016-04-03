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
        var html = this.fieldCreatorTemplate(
          {
            ships: [
              { cells: 4, count: 1 },
              { cells: 3, count: 2 },
              { cells: 2, count: 3 },
              { cells: 1, count: 4 }
            ],
            field: this.fieldTemplate({
              size: 10
            })
          }
        );
      }

      this.$el.html(html);
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

define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var template = require('templates/game-start');
  var fieldTemplate = require('templates/game-field');

  var GameStartView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.fieldTemplate = fieldTemplate;
    },

    setProps: function(props) {
      this.props = props;
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
    }
  });

  return GameStartView;
});

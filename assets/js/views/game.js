define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/game');

  var GameView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.render();
    },

    render: function() {
      var html = this.template({
        size: 10
      });
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

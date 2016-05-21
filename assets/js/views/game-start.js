define(function(require) {
  var View = require('views/base');
  var template = require('templates/game-start');

  var GameStartView = View.Page.extend({
    initialize: function() {
      this.template = template;
    },

    render: function() {
      var html = this.template({
        ships: [
          {decks: 4, count: 1}
        ]
      });
      this.$el.html(html);

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


define(function(require) {
  var View = require('views/base');
  var template = require('templates/game');

  var GameView = View.Page.extend({
    initialize: function() {
      this.template = template;
    },

    render: function() {
      var html = this.template();
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

  return GameView;
});

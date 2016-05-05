define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/main');

  var MainView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
    },

    render: function() {
      var html = this.template();
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

  return MainView;
});

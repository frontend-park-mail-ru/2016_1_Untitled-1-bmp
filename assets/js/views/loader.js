define(function(require) {
  var View = require('views/base');

  var LoaderView = View.Page.extend({
    initialize: function() {
      this.$el = $('.page-loader');
    },

    show: function(cb, duration) {
      this.$el.fadeIn({
        duration: duration || 500,
        complete: cb || function() {}
      });
    },

    hide: function(cb, duration) {
      this.$el.fadeOut({
        duration: duration || 500,
        complete: cb || function() {}
      });
    }
  });

  return new LoaderView();
});

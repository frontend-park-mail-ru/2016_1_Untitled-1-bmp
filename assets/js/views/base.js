define(function(require) {
  var Backbone = require('backbone');

  return {
    Page: Backbone.View.extend({
      isShown: false,
      isRendered: false
    }),

    Simple: Backbone.View
  };
});

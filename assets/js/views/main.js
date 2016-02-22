define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var mainTemplate = require('templates/main');

  var mainView = Backbone.View.extend({
    template: mainTemplate,
    initialize: function() {
      this.render();
    },

    render: function() {
      var html = mainTemplate();
      this.$el.html(html);
      return this;
    }
  });

  return new mainView();
});

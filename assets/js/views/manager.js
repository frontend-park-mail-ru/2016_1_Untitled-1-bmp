define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/main');

  var ViewManager = Backbone.View.extend({
    views: [],

    addView: function(view) {
      this.views.push(view);
      this.listenTo(view, 'show', this.onChangeView.bind(this, view));
    },

    onChangeView: function(newView) {
      _.each(this.views, function(view) {
        if(view == newView) return;

        if(typeof view.hide === 'function') {
          view.hide();
        }
      });
    }

  });

  return new ViewManager();
});

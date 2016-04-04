define(function(require) {
  var Backbone = require('backbone');
  var app = require('app');

  var ViewManager = Backbone.View.extend({
    el: $('#page'),

    views: [],

    initialize: function() {
      this.listenTo(app, 'auth', this.onAuth.bind(this));
    },

    addView: function(view) {
      this.views.push(view);
      this.$el.append(view.el);
      this.listenTo(view, 'show', this.onChangeView.bind(this, view));
    },

    handleViewsEvent: function(method, args, views) {
      views = views || this.views;

      _.each(views, function(view) {
        if(typeof view[method] === 'function') {
          view[method].apply(view, args);
        }
      });
    },

    onChangeView: function(newView) {
      var views = _.filter(this.views, function(view) {
        return view != newView;
      });

      return this.handleViewsEvent('hide', [], views);
    },

    onAuth: function(result) {
      return this.handleViewsEvent('onAuth', arguments);
    }
  });

  return new ViewManager();
});

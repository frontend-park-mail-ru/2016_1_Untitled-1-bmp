define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();

  _.each([mainView,
         scoreboardView], function(view) {
           viewManager.addView(view);
  });

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      '*default':   'defaultAction',
    },

    go: function(where) {
      return this.navigate(where, { trigger: true });
    },

    defaultAction: function () {
      mainView.show();
    },

    scoreboardAction: function () {
      scoreboardView.show();
    }
  });

  return new Router();
});

define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var alertify = require('alertify');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      UserView = require('views/user'),
      RulesView = require('views/rules');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var userView = new UserView();
  var rulesView = new RulesView();

  _.each([mainView,
         scoreboardView,
         userView,
         rulesView
  ], function(view) {
           viewManager.addView(view);
  });

  var loader = require('loader');

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      'rules': 'rulesAction',
      'user/:tab': 'userAction',
      '*default':   'defaultAction',
    },

    go: function(where) {
      return this.navigate(where, { trigger: true });
    },

    goSilent: function(where) {
      return this.navigate(where, { trigger: false });
    },

    defaultAction: function() {
      mainView.show(loader);
    },

    scoreboardAction: function() {
      scoreboardView.show(loader);
    },

    rulesAction: function() {
      rulesView.show(loader);
    },

    userAction: function(tab) {
      if(app.getAuthData().isAuth) {
        this.go('');
        return;
      }
      userView.show(loader);
      userView.tab(tab);
    }
  });

  return new Router();
});

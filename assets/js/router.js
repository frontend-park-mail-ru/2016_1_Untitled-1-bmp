define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var MainView = require('views/main'),
      ScoreboardView = require('views/scoreboard'),
      UserView = require('views/user');

  var viewManager = require('views/manager');

  var mainView = new MainView();
  var scoreboardView = new ScoreboardView();
  var userView = new UserView();

  _.each([mainView,
         scoreboardView,
         userView], function(view) {
           viewManager.addView(view);
  });

  var loader = require('loader');

  var Router = Backbone.Router.extend({
    routes: {
      'scoreboard': 'scoreboardAction',
      'user/:tab': 'userAction',
      'game': 'gameAction',
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

    userAction: function(tab) {
      userView.show(loader);
      userView.tab(tab);
    },

    gameAction: function() {
      if(!app.getAuthData().isAuth) {
        this.go('user/login');
        return;
      }
      console.log('here we start a game');
    }
  });

  return new Router();
});

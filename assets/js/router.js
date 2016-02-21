define(function(require) {
  var Backbone = require('backbone');

  var Router = Backbone.Router.extend({
    routes: {
      'main': 'defaultAction',
      'scoreboard': 'scoreboardAction',
      'new/game': 'newGameAction',
      'login': 'loginAction',
      '*default': 'defaultAction',
    },

    defaultAction: function() {
      console.log('default');
    },

    scoreboardAction: function() {
      console.log('scoreboard');
    },

    newGameAction: function() {
      console.log('new/game');
    },

    loginAction: function() {
      console.log('login');
    }
  });

  return new Router();
});

define(function(require) {
  var Backbone = require('backbone');

  var GameSession = Backbone.Model.extend({
    initialize: function(provider) {
      this.provider = provider;
      provider.on('connection', this._onConnection.bind(this));
      provider.on('message', this._onMessage.bind(this));
    },

    _onConnection: function(res) {
      console.log('gameSession: connect', res);
    },

    _onMessage: function(msg) {
      console.log('gameSession: message', msg);
    }
  });

  return GameSession;
});

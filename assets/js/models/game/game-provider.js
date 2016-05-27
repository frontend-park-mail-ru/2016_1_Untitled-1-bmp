define(function(require) {
  var Backbone = require('backbone');

  var GameProviderOffline = require('models/game/game-provider-offline');
  var GameProviderOnline = require('models/game/game-provider-online');
  var GameProps = require('models/game/game-props');
  var GameSession = require('models/game/game-session');

  var GameProvider = Backbone.Model.extend({
    initialize: function() {
      this.props = GameProps.get();
      this.providerOnline = new GameProviderOnline(this.props);
      this.providerOffline = new GameProviderOffline(this.props);
    },

    checkGame: function(provider) {
      this.listenTo(provider, 'message', function(message) {
        if(message.type === 'game_status') {
          this.trigger('checkGame', {
            connection: true,
            exists: message.ok,
            session: message.ok ? new GameSession(provider) : undefined
          });
          this.stopListening(provider, 'message');
        }
      }.bind(this));

      provider.once('connection', function(res) {
        if(res.open) {
          provider.requestStatus();
        }
        else {
          this.trigger('checkGame', {
            connection: false,
            exists: false
          });
        }
      }.bind(this));

      provider.connect();
    },

    checkOnlineGame: function() {
      return this.checkGame(this.providerOnline);
    },

    checkOfflineGame: function() {
      return this.checkGame(this.providerOffline);
    },

    startGame: function(provider, ships, mode, id) {
      var session = new GameSession(provider);
      provider.once('connection', function(res) {
        this.trigger('startGame', {
                       result: res.open,
                       session: session
        });
      }.bind(this));
      provider.connect();
      provider.requestInit(ships, mode, id);
      provider.requestStatus();
    },

    startOnlineGame: function(ships, mode, id) {
      return this.startGame(this.providerOnline, ships, mode, id);
    },

    startOfflineGame: function(ships, mode, id) {
      return this.startGame(this.providerOffline, ships, mode, id);
    },

    getModes: function() {
      var isOffline = require('app').isOffline();
      return (isOffline ? GameProviderOffline : GameProviderOnline).getModes();
    }
  });

  return new GameProvider();
});

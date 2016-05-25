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

    checkOnlineGame: function() {
      this.providerOnline.on('message', function(message) {
        if(message.type === 'game_status') {
          this.trigger('checkOnlineGame', {
            connection: true,
            exists: message.ok,
            session: message.ok ? new GameSession(this.providerOnline) : undefined
          });
        }
      }.bind(this));

      this.providerOnline.once('connection', function(res) {
        if(res.open) {
          this.providerOnline.requestStatus();
        }
        else {
          this.trigger('checkOnlineGame', {
            connection: false,
            exists: false
          });
        }
      }.bind(this));

      this.providerOnline.connect();
    },

    checkOfflineGame: function() {
    },

    startOnlineGame: function(ships, mode, id) {
      var session = new GameSession(this.providerOnline);
      this.providerOnline.once('connection', function(res) {
        this.trigger('startGameSession', {
                       result: res.open,
                       session: session
        });
      }.bind(this));
      this.providerOnline.connect();
      this.providerOnline.requestInit(ships, mode, id);
      this.providerOnline.requestStatus();
    },

    getModes: function() {
      var isOffline = require('app').isOffline();
      return (isOffline ? GameProviderOffline : GameProviderOnline).getModes();
    }
  });

  return new GameProvider();
});

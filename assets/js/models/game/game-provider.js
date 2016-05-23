define(function(require) {
  var Backbone = require('backbone');

  var GameProviderOffline = require('models/game/game-provider-offline');
  var GameProviderOnline = require('models/game/game-provider-online');
  var GameProps = require('models/game/game-props');

  var GameProvider = Backbone.Model.extend({
    initialize: function() {
      this.props = GameProps.get();
      this.providerOnline = new GameProviderOnline(this.props);
      this.providerOffline = new GameProviderOffline(this.props);
    },

    checkOnlineConnection: function() {
    },

    checkOnlineGame: function() {
    },

    checkOfflineGame: function() {
    }
  });

  return new GameProvider();
});

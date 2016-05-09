define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var GameSessionProviderWebSocket = require('game/game-session-provider-websocket');
  var GameSessionProviderBot = require('game/game-session-provider-bot');

  var GameSessionProperties = require('game/game-field-props');
  var props = GameSessionProperties.getProperties();

  var GameSessionProvider = Backbone.Model.extend({
    initialize: function(props) {
      this.props = props;
      this.providers = {
        websocket: GameSessionProviderWebSocket,
        bot: GameSessionProviderBot
      };

      this.exists = false;
      this.existingProviders = [];
    },

    checkExisting: function(cb) {
      var checked = [];
      var exists = [];

      var checkAll = function() {
        if(checked.length === this.providers.length) {
          this.exists = exists.length > 0;
          this.existingProviders = exists;

          if(typeof cb == 'function') {
            this.once('checkedExisting', cb);
          }

          this.trigger('checkedExisting', {
            exists: this.exists,
            existingProviders: this.existingProviders
          });
        }
      }.bind(this);

      _.each(this.providers, function(providerClass, key) {
        var provider = new providerClass(props);

        var onGameStatus = function(data) {
          console.log(key, 'game_status', data);
          checked.push(key);
          if(data.exists) {
            exists.push(key);
          }

          provider.disconnect();
          checkAll();
        }.bind(this);

        var onConnected = function(data) {
          console.log(key, 'connected', data);
          if(!data.open) {
            checked.push(key);
            return;
          }

          provider.once('game_status', onGameStatus);
          provider.requestStatus();
        }.bind(this);

        provider.once('connection', onConnected);
        provider.connect();
      }.bind(this));
    },

    init: function(provider, mode) {
    },

    getExisting: function(provider) {
    }
  });

  return new GameSessionProvider(props);
});

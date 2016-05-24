define(function(require) {
  var Backbone = require('backbone');

  var Queue = require('models/queue');

  var GameSession = Backbone.Model.extend({
    initialize: function(provider) {
      this.provider = provider;
      this.provider.on('connection', this._onConnection.bind(this));
      this.provider.on('message', this._onMessage.bind(this));

      this.queue = new Queue(1500);
      this.queue.on('handle', this._onHandle.bind(this));
    },

    getProps: function() {
      return this.provider.getProps();
    },

    connect: function() {
      return this.provider.connect();
    },

    getStatus: function() {
      return this.provider.requestStatus();
    },

    shoot: function(x, y) {
      return this.provider.requestShoot(x, y);
    },

    giveUp: function() {
      return this.provider.requestGiveUp();
    },

    _onConnection: function(res) {
      console.log('gameSession: connection', res);
      this.trigger('connection', {
        open: res.open
      });
    },

    _onMessage: function(msg) {
      this.queue.push(msg);
    },

    _onHandle: function(msg) {
      console.log('gameSession: handle', msg);
      this.trigger('message', msg);
    }
  });

  return GameSession;
});

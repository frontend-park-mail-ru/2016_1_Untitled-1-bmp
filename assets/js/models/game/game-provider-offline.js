define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var GameField = require('models/game/game-field');

  var cache = require('cache');

  var CACHE_OFFLINE_GAME_STATE = 'offline-game-state';
  var animals = [ 'camel', 'chupacabra', 'giraffe', 'monkey', 'grizzly', 'chameleon', 'elephant', 'hyena', 'frog', 'sheep', 'turtle', 'iguana', 'lemur', 'hippo', 'coyote', 'wolf', 'panda', 'python' ];

  var GameProviderOffline = Backbone.Model.extend({
    _state: undefined,

    initialize: function(props) {
      this.props = props;
    },

    getProps: function() {
      return this.props;
    },

    connect: function() {
      this.trigger('connection', {
        open: true
      });
    },

    sendMessage: function(type, data) {
      data = data || {};
      this.trigger('message', _.extend(data, { type: type }));
    },

    requestStatus: function() {
      if(!this.exists()) {
        this.sendMessage('game_status', { ok: false });
        return;
      }

      var state = this._getState();

      var ships = state.field.getShips();
      var shoots = _.map(state.field.getCells(), function(cell) {
        return [cell.x, cell.y, cell.state === GameField.STATE_SHIP_WOUND];
      });

      var info = {
        ok: true,
        started: true,
        ships: ships,
        killedShips: [],
        shoots: shoots,
        opponentName: state.opponentName,
        opponentShips: [],
        opponentShoots: [],
        turn: true
      };

      this.sendMessage('game_status', info);

      if(!state.turn) {
        this.makeTurn();
      }
    },

    requestInit: function(ships, mode, id) {
      var currentField = new GameField(this.props);
      _.each(ships, function(ship) {
        currentField.addShip.apply(currentField, ship);
      }, this);
      var opponentName = 'Anonymous ' + animals[Math.floor(Math.random() * animals.length)];
      var opponentField = GameField.generateRandomField(this.props);

      var state = {
        field: currentField,
        opponentName: opponentName,
        opponentField: opponentField,
        turn: Math.random() > 0.5
      };
      this._setState(state);

      this.requestStatus();
      this.sendMessage('game_init', { ok: true });
      this.sendMessage('game_start', { ok: true, opponentName: opponentName });

      if(!state.turn) {
        this.makeTurn();
      }
    },

    requestShoot: function(x, y) {
    },

    requestGiveUp: function() {
      this.sendMessage('game_over', { ok: false });
      cache.remove(CACHE_OFFLINE_GAME_STATE);
    },

    makeTurn: function() {
    },

    exists: function() {
      return !!cache.get(CACHE_OFFLINE_GAME_STATE);
    },

    _getState: function() {
      if(!this._state) {
        var state = cache.get(CACHE_OFFLINE_GAME_STATE);

        var currentField = new GameField(this.props);
        _.each(state.ships, function(ship) {
          currentField.addShip.apply(currentField, ship);
        }, this);
        _.each(state.shoots, function(shoot) {
          currentField.setCell.setCell(shoot.x, shoot.y, shoot.state);
        }, this);

        var opponentField = new GameField(this.props);
        _.each(state.opponentShips, function(ship) {
          opponentField.addShip.apply(opponentField, ship);
        }, this);
        _.each(state.opponentShoots, function(shoot) {
          opponentField.setCell.setCell(shoot.x, shoot.y, shoot.state);
        }, this);

        this._state = {
          field: currentField,
          opponentName: state.opponentName,
          opponentField: opponentField,
          turn: state.turn
        };
      }

      return this._state;
    },

    _setState: function(state) {
      this._state = state;
      var _state = {
        ships: state.field.getShips(),
        shoots: state.field.getCells(),
        opponentName: state.opponentName,
        opponentShips: state.opponentField.getShips(),
        opponentShoots: state.opponentField.getCells(),
        turn: state.turn
      };
      cache.set(CACHE_OFFLINE_GAME_STATE, _state);
    },

    _finish: function() {
    }
  });

  GameProviderOffline.getModes = function() {
    return {
      bot: {
        text: 'Бот офлайн',
        desciption: ''
      }
    };
  };

  return GameProviderOffline;
});

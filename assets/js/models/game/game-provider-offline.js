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

      var opponentShoots = _.map(state.opponentField.getCells(), function(cell) {
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
        opponentShoots: opponentShoots,
        turn: state.turn
      };

      this.sendMessage('game_status', info);
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
        turn: Math.random() > 0.5,
        latestShoots: []
      };
      this._setState(state);

      this.sendMessage('game_init', { ok: true });
      this.sendMessage('game_start', { ok: true, opponentName: opponentName });
      this.requestStatus();

      this.makeTurn();
    },

    requestShoot: function(x, y) {
      var state = this._getState();

      if(!state.turn) {
        return;
      }

      var cellState = state.opponentField.getCell(x, y);

      if(cellState === GameField.STATE_MISS || cellState === GameField.STATE_SHIP_WOUND) {
        return;
      }

      if(cellState == GameField.STATE_EMPTY) {
        state.opponentField.setCell(x, y, GameField.STATE_MISS);
        this._setState(state);
        state.turn = false;
        this._setState(state);
        this.sendMessage('shoot_result', { ok: false, x: x, y: y, status: 'miss' });
        _.defer(function() { this.makeTurn(); }.bind(this));
      }
      else if(cellState == GameField.STATE_SHIP) {
        state.opponentField.setCell(x, y, GameField.STATE_SHIP_WOUND);
        console.warn('after', x, y, state.opponentField.getCells());
        state.turn = true;
        var isKilled = state.opponentField.isShipKilled(x, y);

        var info = {
          ok: false,
          x: x,
          y: y
        };
        if(isKilled) {
          var ship = state.opponentField.findShipByCell(x, y);
          info.status = 'killed';
          info.startX = ship[0];
          info.startY = ship[1];
          info.length = ship[2];
          info.isVertical = ship[3];

          _.each(GameField.getShipNearCells(ship[0], ship[1], ship[2], ship[3], this.props), function(cell) {
            state.opponentField.setCell(cell[0], cell[1], GameField.STATE_MISS);
          }, this);
        }
        else {
          info.status = 'wound';
        }
        this._setState(state);
        this.sendMessage('shoot_result', info);
        _.defer(function() { this.makeTurn(); }.bind(this));
      }
    },

    requestGiveUp: function() {
      this._finish(false);
    },

    makeTurn: function() {
      var state = this._getState();
      this.sendMessage('game_turn', { ok: state.turn });

      if(state.turn) {
        return;
      }

      if(!state.latestShoots || state.latestShoots.length == 0) {
        while(true) {
          var x = Math.floor(Math.random() * this.props.getSize()) + 1;
          var y = Math.floor(Math.random() * this.props.getSize()) + 1;

          if(x > this.props.getSize() || y > this.props.getSize()) {
            continue;
          }

          var cellState = state.field.getCell(x, y);

          if(cellState === GameField.STATE_MISS || cellState === GameField.STATE_SHIP_WOUND) {
            continue;
          }

          if(cellState == GameField.STATE_EMPTY) {
            state.field.setCell(x, y, GameField.STATE_MISS);
            state.latestShoots = [];
            state.turn = true;
            this._setState(state);
            this.sendMessage('shoot_result', { ok: true, x: x, y: y, status: 'miss' });
            _.defer(function() { this.makeTurn(); }.bind(this));
            break;
          }
          else if(cellState == GameField.STATE_SHIP) {
            state.field.setCell(x, y, GameField.STATE_SHIP_WOUND);
            state.latestShoots = [];
            state.turn = false;
            var isKilled = state.field.isShipKilled(x, y);

            var info = {
              ok: true,
              x: x,
              y: y
            };
            if(isKilled) {
              var ship = state.field.findShipByCell(x, y);
              info.status = 'killed';
              info.startX = ship[0];
              info.startY = ship[1];
              info.length = ship[2];
              info.isVertical = ship[3];
              console.warn('here', ship);

              _.each(GameField.getShipNearCells(ship[0], ship[1], ship[2], ship[3], this.props), function(cell) {
                state.field.setCell(cell[0], cell[1], GameField.STATE_MISS);
              }, this);
            }
            else {
              info.status = 'wound';
            }
            this._setState(state);
            this.sendMessage('shoot_result', info);
            _.defer(function() { this.makeTurn(); }.bind(this));
            break;
          }
        }
      }
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
          currentField.setCell(shoot.x, shoot.y, shoot.state);
        }, this);

        var opponentField = new GameField(this.props);
        _.each(state.opponentShips, function(ship) {
          opponentField.addShip.apply(opponentField, ship);
        }, this);
        _.each(state.opponentShoots, function(shoot) {
          opponentField.setCell(shoot.x, shoot.y, shoot.state);
        }, this);

        this._state = {
          field: currentField,
          opponentName: state.opponentName,
          opponentField: opponentField,
          turn: state.turn,
          latestShoots: state.latestShoots
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
        turn: state.turn,
        latestShoots: state.latestShoots
      };
      cache.set(CACHE_OFFLINE_GAME_STATE, _state);
    },

    _finish: function(win) {
      this.sendMessage('game_over', { ok: !!win });
      cache.remove(CACHE_OFFLINE_GAME_STATE);
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

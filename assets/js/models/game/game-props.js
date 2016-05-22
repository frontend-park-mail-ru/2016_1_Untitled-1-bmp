define(function(require) {
  var data = {
    "10x10": {
      size: 10,
      maxdeck: 4,
      ship4: 1,
      ship3: 2,
      ship2: 3,
      ship1: 4
    }
  };

  var gamePropertiesCreator = function(gameMode) {
    var props = {
      getSize: function() {
        return data[gameMode].size;
      },

      getMaxDeck: function() {
        return data[gameMode].maxdeck;
      },

      getShips: function(decks) {
        var count = data[gameMode][('ship' + decks)];
        return count === undefined ? 0 : count;
      }
    };

    return props;
  };

  var instances = {};

  var GameProperties = {
    get: function(gameMode) {
      gameMode = gameMode || '10x10';

      if(instances[gameMode] === undefined) {
        instances[gameMode] = gamePropertiesCreator(gameMode);
      }

      return instances[gameMode];
    }
  };

  return GameProperties;
});

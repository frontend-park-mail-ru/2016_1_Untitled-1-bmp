define(function(require) {
  var Backbone = require('backbone');

  var ScoreBoard = Backbone.Collection.extend({
    model: require('models/score'),
    comparator: function(item) {
      return -item.get('score');
    }
  });

  return ScoreBoard;
});

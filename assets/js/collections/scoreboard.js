define(function(require) {
  var Backbone = require('backbone');
  var model = require('models/score');

  var ScoreBoard = Backbone.Collection.extend({
    model: model,
    comparator: function(item) {
      return -item.get('score');
    }
  });

  return ScoreBoard;
});

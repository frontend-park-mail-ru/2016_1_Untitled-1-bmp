define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var scoreboardTemplate = require('templates/scoreboard');
  var scoreModel = require('models/score');

  var scoreboardView = Backbone.View.extend({
    template: scoreboardTemplate,
    collection: null,
    initialize: function() {
      var Collection = Backbone.Collection.extend({
        model: function(attrs, options) {
          return new scoreModel(attrs, options);
        }
      });

      this.collection = new Collection();

      this.collection.add([
        {
          name: 'AAA',
          score: 100
        },
        {
          name: 'New name'
        }
      ]);

      this.render();
    },

    render: function() {
      console.log(this.collection);
      var scores = this.collection.map(function(item) {
        return {
          name: item.get('name'),
          score: item.get('score')
        };
      });
      console.log(scores);
      var html = scoreboardTemplate({'scores': scores});
      this.$el.html(html);
      return this;
    }
  });

  return new scoreboardView();
});

define(function(require) {
  var Backbone = require('backbone');
  var ScoreBoardCollection = require('collections/scoreboard');
  var template = require('templates/scoreboard');

  var ScoreboardView = Backbone.View.extend({
    initialize: function() {
      this.template = template;
      this.collection = new ScoreBoardCollection(
        [
          { 'name': 'Владимир Кличко',      'score' : 100 },
          { 'name': 'Халк',                 'score' : 509 },
          { 'name': 'Виктор Пелевин',       'score' : 104 },
          { 'name': 'Полковник',            'score' : 888 },
          { 'name': 'Джон Леннон',          'score' : 930 },
          { 'name': 'Михаил Ходорковский',  'score' : 391 },
          { 'name': 'Дядя Вова',            'score' : 175 },
          { 'name': 'Диего Дзодана',        'score' : 45 },
          { 'name': 'Рома Широков',         'score' : 9 },
          { 'name': 'Валерий Самерман',     'score' : 956 }
        ]
      );

      this.render();
    },

    render: function() {
      var html = this.template({
        'scores': this.collection.toJSON()
      });

      this.$el.html(html);
    },

    show: function() {
      this.trigger('show');
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return ScoreboardView;
});

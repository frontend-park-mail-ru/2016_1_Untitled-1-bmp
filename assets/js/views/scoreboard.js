define(function(require) {
  var Backbone = require('backbone');
  var ScoreBoardCollection = require('collections/scoreboard');
  var template = require('templates/scoreboard');
  var scene = require('features/scene-dots');

  var ScoreboardView = Backbone.View.extend({
    events: {
      'click .scene-dots__button-previous': 'showPrevious',
      'click .scene-dots__button-next': 'showNext'
    },

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

      this.index = 0;
      this.scene = scene(this.$el.find('.scene-dots__canvas'));
      this.$name = this.$el.find('.scene-dots__name');

      this.showRecord();
    },

    showRecord: function() {
      var row = this.collection.at(this.index);
      this.$name.text('#' + (this.index + 1).toString() + ' ' + row.get('name'));
      this.scene.word(row.get('score'));
    },

    showPrevious: function() {
      this.index--;
      if(this.index < 0) {
        this.index = this.collection.length - 1;
      }

      this.showRecord();
      return false;
    },

    showNext: function() {
      this.index++;

      if(this.index >= this.collection.length) {
        this.index = 0;
      }

      this.showRecord();
      return false;
    },

    render: function() {
      var html = this.template();

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

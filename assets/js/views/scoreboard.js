define(function(require) {
  var View = require('views/base');
  var ScoreBoardCollection = require('collections/scoreboard');
  var template = require('templates/scoreboard');
  var scene = require('features/scene-dots');

  var ScoreboardView = View.Page.extend({
    events: {
      'click .scene-dots__button-previous': 'showPrevious',
      'click .scene-dots__button-next': 'showNext'
    },

    initialize: function() {
      this.template = template;
      this.isShown = false;

      this.isRendered = false;
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
      if(!this.isRendered) {
        var html = this.template();
        this.$el.html(html);
        this.scene = scene(this.$el.find('.scene-dots__canvas'));
        this.$name = this.$el.find('.scene-dots__name');

        this.isRendered = true;
      }

      this.index = 0;
      this.showRecord();
    },

    show: function(loader) {
      loader(function(cb) {
        var toShow = function() {
          if(this.collection.length == 0) {
            this.collection = new ScoreBoardCollection([{ name: 'Нет данных', score: ':-('}]);
          }
          this.trigger('show');
          this.render();
          this.$el.show();

          cb();
        }.bind(this);

        this.collection = new ScoreBoardCollection();
        this.collection.fetch({
          success: toShow,
          error: toShow
        });

      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
    },

    showUserPanel: function() {
      return false;
    }
  });

  return ScoreboardView;
});

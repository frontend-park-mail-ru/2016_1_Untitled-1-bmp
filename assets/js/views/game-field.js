define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var GameField = require('models/game/game-field');

  var template = require('templates/game-field');

  var GameFieldView = Backbone.View.extend({
    initialize: function(props) {
      this.props = props;
      this.model = new GameField(props);
    },

    render: function() {
      var html = template({
        letters: 'АБВГДЕЖЗИКЛМНОПРСТ'.split(''),
        size: this.props.getSize(),
        caption: '',
        captionInfo: ''
      });
      this.$el.html(html);

      this.$caption = this.$el.find('.js-caption');
      this.$captionInfo = this.$el.find('.js-caption-info');
    },

    setCaption: function(text) {
      this.$caption.html(text);
    },

    setCaptionInfo: function(text) {
      this.$captionInfo.html(text);
    },

    show: function() {
      this.render();
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    }
  });

  return GameFieldView;
});

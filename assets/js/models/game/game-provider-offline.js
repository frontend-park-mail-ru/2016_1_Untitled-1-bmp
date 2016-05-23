define(function(require) {
  var Backbone = require('backbone');

  var GameProviderOffline = Backbone.Model.extend({
    initialize: function(props) {
      this.props = props;
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

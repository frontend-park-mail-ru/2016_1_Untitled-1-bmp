define(function(require) {
  var Backbone = require('backbone');

  var GameProviderOffline = Backbone.Model.extend({
    initialize: function(props) {
      this.props = props;
    }
  });

  return GameProviderOffline;
});

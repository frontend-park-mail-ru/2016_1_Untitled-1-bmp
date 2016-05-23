define(function(require) {
  var Backbone = require('backbone');

  var GameProviderOnline = Backbone.Model.extend({
    initialize: function(props) {
      this.props = props;
    }
  });

  return GameProviderOnline;
});

define(function(require) {
  var View = require('views/base');
  var template = require('templates/main');

  var MainView = View.Page.extend({
    initialize: function() {
      this.template = template;

      this.links = {
        game: {
          url: '#game',
          modifier: 'play',
          text: 'Играть'
        },
        scoreboard: {
          url: '#scoreboard',
          modifier: 'records',
          text: 'Рекорды'
        },
        rules: {
          url: '#rules',
          modifier: 'rules',
          text: 'Правила'
        }
      };
    },

    render: function() {
      var html = this.template({
        links: _.map(this.links, function(link, key) {
          return _.extend(link, { key: key });
        })
      });
      this.$el.html(html);

      this.isRendered = true;
    },

    show: function(loader) {
      if(this.isShown) return;

      loader(function(cb) {
        this.trigger('show');

        if(!this.isRendered) this.render();

        this.$el.show();
        this.isShown = true;
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
      this.isShown = false;
    }
  });

  return MainView;
});

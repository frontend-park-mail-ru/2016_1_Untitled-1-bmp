define(function(require) {
  var $ = require('jquery');

  var rand = function(max) {
    return Math.random() * max * (Math.random() > 0.5 ? -1 : 1);
  };

  return function(el) {
    var $el = $(el);
    var id = undefined;

    return {
      start: function() {
        if(id) return;

        var action = function() {
          $el.children('.scene-chaos__element').each(function(k, el) {
            var $cur = $(el);
            var top = $(el).position().top + rand(300);
            if(top < 0) {
              top += Math.random() * 400;
            }
            var left = $(el).position().left + rand(400);
            if(left < 0) {
              left += Math.random() * 400;
            }
            $cur.css({
              top: top + 'px',
              left: left + 'px',
              opacity: Math.random() * 0.6 + 0.4
            });
          });
        };
        action();

        id = setInterval(action, 20000);
      },

      stop: function() {
        if(id) {
          id = undefined;
          clearInterval(id);
        }
      }
    };
  };
});

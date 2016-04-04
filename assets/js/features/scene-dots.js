define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');

  var Drawer = require('./scene-dots/drawer');
  var Shape = require('./scene-dots/shape');
  var ShapeBuilder = require('./scene-dots/shapebuilder');

  return (function(elem) {
    var drawer = new Drawer(elem);
    var shape = new Shape(drawer);
    var shapeBuilder = new ShapeBuilder();

    drawer.setLoopFunction(function() {
      shape.render();
    });

    drawer.loop();

    return {
      word: function(what) {
        shape.change(shapeBuilder.word(what));
      }
    };
  });
});

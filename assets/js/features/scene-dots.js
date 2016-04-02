define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');

  var Drawer = require('./scene-dots/drawer');
  var Shape = require('./scene-dots/shape');
  var ShapeBuilder = require('./scene-dots/shapebuilder');

  return (function() {
    var drawer = new Drawer('.canvas');

    var shape = new Shape(drawer);
    var shapeBuilder = new ShapeBuilder();

    shape.change(shapeBuilder.word('456'));

    drawer.setLoopFunction(function() {
      shape.render();
    });

    drawer.loop();
  });

});

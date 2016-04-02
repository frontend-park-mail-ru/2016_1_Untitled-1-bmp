define(function(require) {
  var $ = require('jquery');

  var Color = function(r, g, b, alpha) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
  };

  Color.prototype.getRGBa = function() {
    return 'rgba(' + [this.r, this.g, this.b, this.alpha].join(',') + ')';
  };

  var Point = function(x, y) {
    this.x = x;
    this.y = y;
  };

  var Dot = function(x, y, drawer) {
    this.point = new Point(x, y);
    this.radius = 5;

    this.drawer = drawer;

    var alpha = 1;
    this.color = new Color(255, 255, 255, alpha);

    this.pointTo = this.point;
    this.pointsTo = [];
  }

  Dot.prototype.__draw = function() {
    this.drawer.drawCircle(this.point, this.radius, this.color);
  };

  Dot.prototype.__recount = function() {
  };

  Dot.prototype.moveTo = function(newPoint) {
  };

  Dot.prototype.distance = function(newPoint, info) {
    return Dot.distance(this, newPoint, info);
  };

  Dot.distance = function(dot1, dot2, info) {
    var data = {
      dx: dot1.x - dot2.x,
      dy: dot1.y - dot2.y,
      d: Math.sqrt(dx * dx + dy * dy)
    };

    return info ? data : data.d;
  };

  var Shape = function() {
  };

  var Drawer = function(elem) {
    if($(elem).length == 0) {
      return;
    }

    this.canvas = $(elem)[0];
    this.context = this.canvas.getContext('2d');

    this.onResize();

    window.addEventListener('resize', this.onResize.bind(this));

    this.requestFrame = window.requestAnimationFrame       ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame    ||
                        window.oRequestAnimationFrame      ||
                        window.msRequestAnimationFrame     ||
                        function (callback) {
                          window.setTimeout(callback, 1000 / 60);
                        };
  };

  Drawer.prototype.onResize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  Drawer.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Drawer.prototype.loop = function() {
    this.clear();

    var dot = new Dot(100, 100, this);
    dot.__draw();

    this.requestFrame.call(window, this.loop.bind(this));
  };

  Drawer.prototype.drawCircle = function(point, radius, color) {
    this.context.fillStyle = color.getRGBa();
    this.context.beginPath();
    this.context.arc(point.x, point.y, radius, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.fill();
  };

  return Drawer;
});

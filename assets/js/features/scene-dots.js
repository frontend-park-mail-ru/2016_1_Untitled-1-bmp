define(function(require) {
  var $ = require('jquery');

  var Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };
  Color.prototype.get = function() {
    return 'rgba(' + [this.r, this.g, this.b, this.a].join(',') + ')';
  };

  // var c = new Color(255, 255, 255, 0.43);
  // console.log(c);
  // console.log(c.get());

  var Point = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  };

  var Dot = function(x, y) {
    this.point = new Point(x, y, 5);
  }

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
    // this.context.fillStyle = 'rgba(0,0,0,1)';
    // this.context.beginPath();
    // this.context.arc(100, 100, 100, 0, 2 * Math.PI, true);
    // this.context.closePath();
    // this.context.fill();

    this.requestFrame.call(window, this.loop.bind(this));
  };

  return Drawer;
});

define(function(require) {
  var Backbone = require('backbone');

  var router = require('router');
  var app = require('app');

  var cache = require('cache');

  app.start(function() {
    Backbone.history.start();
  });
});

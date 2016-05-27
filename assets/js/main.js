define(function(require) {
  var Backbone = require('backbone');

  var router = require('router');
  var app = require('app');

  var cache = require('cache');

  var alertifyConfig = require('vendor/alertify-config');

  app.start(function() {
    router.init();
    Backbone.history.start();
  });
});

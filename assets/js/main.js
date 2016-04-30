define(function(require) {
  var Backbone = require('backbone');

  var loader = require('views/page-loader');
  loader.hide();

  var router = require('router');
  var app = require('app');

  Backbone.history.start();
});

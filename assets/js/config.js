require.config({
  urlArgs: "_=" + (new Date()).getTime(),
  baseUrl: "js",
  paths: {
    jquery: "vendor/jquery",
    underscore: "vendor/underscore",
    backbone: "vendor/backbone"
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    }
  }
});

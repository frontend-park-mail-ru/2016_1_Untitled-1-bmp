require.config({
  urlArgs: "_=" + (new Date()).getTime(),
  baseUrl: "js",
  paths: {
    jquery: "vendor/jquery",
    underscore: "vendor/underscore",
    backbone: "vendor/backbone",
    alertify: "vendor/alertify",
    'alertify-real': "vendor/alertify-real",
    qunit: "vendor/qunit-1.21.0",
    sinon: "vendor/sinon-1.17.3",
    dragula: "vendor/dragula.min"
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'alertify': {
      exports: 'alertify'
    },
    'dragula': {
      exports: 'dragula'
    }
  }
});

define(function(require) {
  var alertify = require('alertify-real');

  alertify.defaults.glossary = {
    title: "Морской бой",
    ok: "Да",
    cancel: "Нет"
  };

  return alertify;
});

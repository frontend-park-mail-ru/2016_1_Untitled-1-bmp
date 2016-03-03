define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var User = Backbone.Model.extend({
    // login, name, email
    initialize: function() {
    },
    validate: function(attrs, options) {
      var errors = [];

      if($.trim(attrs.login) === '') {
        errors.push({
          field: 'login',
          error: 'Вы не указали логин'
        });
      }

      if($.trim(attrs.name) === '') {
        errors.push({
          field: 'name',
          error: 'Вы не указали ваше имя'
        });
      }

      var emailRegexp = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;

      if($.trim(attrs.email) === '') {
        errors.push({
          field: 'email',
          error: 'Вы не указали email'
        });
      }
      else if(!emailRegexp.test($.trim(attrs.email))) {
        errors.push({
          field: 'email',
          error: 'Вы указали некорректный email'
        });
      }

      if(errors.length) {
        return errors;
      }
    }
  });

  return User;
});
